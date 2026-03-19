import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppStore, type FarmerSmsStatus } from '@/store/useAppStore';
import { MessageSquare, Send, MapPin, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Map, { Source, Layer } from "react-map-gl/maplibre";
import { FeatureCollection } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";

const statusConfig: Record<FarmerSmsStatus, { label: string; color: string; mapColor: string }> = {
  pending: { label: 'Pending', color: 'bg-muted text-muted-foreground', mapColor: 'bg-muted-foreground/30' },
  notified: { label: 'SMS Sent', color: 'bg-sand/20 text-sand-foreground border-sand/40', mapColor: 'bg-sand' },
  confirmed: { label: 'Confirmed', color: 'bg-accent text-accent-foreground', mapColor: 'bg-secondary' },
  planted: { label: 'Planted', color: 'bg-primary/15 text-primary border-primary/30', mapColor: 'bg-primary' },
  harvested: { label: 'Harvested', color: 'bg-forest/15 text-forest border-forest/30', mapColor: 'bg-forest' },
};

export function SmsHubView() {
  const contracts = useAppStore((s) => s.contracts);
  const updateFarmerSmsStatus = useAppStore((s) => s.updateFarmerSmsStatus);
  const [broadcasting, setBroadcasting] = useState(false);

  const activeContracts = contracts.filter(c => ['accepted', 'funded', 'in_progress'].includes(c.status) && c.matchedCooperative);
  const [selectedContract, setSelectedContract] = useState<string | null>(activeContracts[0]?.id || null);
  const contract = activeContracts.find(c => c.id === selectedContract);
  const farmers = contract?.matchedCooperative?.members || [];
  
  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;
  const MAP_STYLE = `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`;
  const TERRAIN_URL = `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${MAPTILER_KEY}`;

  const [mapError, setMapError] = useState(!MAPTILER_KEY);
  
  const MapFallback = ({ message }) => (
    <div className="relative flex h-52 items-center justify-center rounded-t-lg bg-muted lg:h-64">
      <MapPin className="h-12 w-12 text-muted-foreground/40" />
      <span className="absolute bottom-3 left-3 rounded-md bg-card/80 px-2 py-1 text-xs font-medium text-heading backdrop-blur">
        {message}
      </span>
    </div>
  );

  const PH_CENTER = {
    longitude: 120.90, 
    latitude: 15.71,
  };

  const plotGeoJSON = useMemo<FeatureCollection | null>(() => {
    if (!contract || !contract.matchedCooperative) return null;

    const shiftedCenter = {
      longitude: PH_CENTER.longitude - 0.002,
      latitude: PH_CENTER.latitude - 0.002,
    }
    
    return {
      type: "FeatureCollection",
      features: contract.matchedCooperative.members.map((farmer, idx) => {
        const plotSize = 0.0006;
        const offset = idx * 0.0010; 
        return {
          type: "Feature",
          properties: { 
            name: farmer.name, 
            status: farmer.smsStatus 
          },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [shiftedCenter.longitude + offset, shiftedCenter.latitude],
              [shiftedCenter.longitude + plotSize + offset, shiftedCenter.latitude],
              [shiftedCenter.longitude + plotSize + offset, shiftedCenter.latitude + plotSize],
              [shiftedCenter.longitude + offset, shiftedCenter.latitude + plotSize],
              [shiftedCenter.longitude + offset, shiftedCenter.latitude],
            ]],
          },
        };
      }),
    };
  }, [contract]);

  const handleBroadcast = () => {
    if (!contract) return;
    setBroadcasting(true);
    farmers.forEach((f, i) => {
      setTimeout(() => {
        updateFarmerSmsStatus(contract.id, f.id, 'notified');
        if (i === farmers.length - 1) {
          setBroadcasting(false);
          toast.success(`SMS broadcast sent to ${farmers.length} farmers!`);
        }
      }, (i + 1) * 400);
    });
  };

  const smsStats = {
    total: farmers.length,
    notified: farmers.filter(f => f.smsStatus !== 'pending').length,
    confirmed: farmers.filter(f => ['confirmed', 'planted', 'harvested'].includes(f.smsStatus)).length,
    planted: farmers.filter(f => ['planted', 'harvested'].includes(f.smsStatus)).length,
    harvested: farmers.filter(f => f.smsStatus === 'harvested').length,
  };

  if (activeContracts.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">SMS & Monitoring Hub</h2>
          <p className="text-sm text-muted-foreground">Broadcast and track farmer responses.</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 font-medium text-muted-foreground">No active contracts</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const coop = contract.matchedCooperative;
  const plots = coop.members.map((farmer) => ({
    name: `${farmer.name.split(" ")[0]}'s Plot`,
    yield: `${Math.round(contract.volumeKg / coop.members.length)} kg est.`,
    status: farmer.smsStatus === "pending" ? "Pending" : "Active",
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">SMS & Monitoring Hub</h2>
          <p className="text-sm text-muted-foreground">Broadcast SMS and monitor farmer planting status.</p>
        </div>
        <Button onClick={handleBroadcast} disabled={broadcasting} className="gap-2">
          {broadcasting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {broadcasting ? 'Sending...' : 'Broadcast SMS'}
        </Button>
      </div>

      {/* Contract Selector */}
      <div className="flex gap-2">
        {activeContracts.map(c => (
          <Button key={c.id} variant={selectedContract === c.id ? 'default' : 'outline'} size="sm" onClick={() => setSelectedContract(c.id)}>
            {c.crop}
          </Button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total', value: smsStats.total, color: 'text-foreground' },
          { label: 'SMS Sent', value: smsStats.notified, color: 'text-sand-foreground' },
          { label: 'Confirmed', value: smsStats.confirmed, color: 'text-secondary' },
          { label: 'Planted', value: smsStats.planted, color: 'text-primary' },
          { label: 'Harvested', value: smsStats.harvested, color: 'text-forest' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Live Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Farmer Status Table</CardTitle>
            <CardDescription>Real-time responses from farmers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {farmers.map((f) => {
                  const cfg = statusConfig[f.smsStatus];
                  return (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">{f.name}</TableCell>
                      <TableCell className="text-muted-foreground">{f.location}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cfg.color}>{cfg.label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Interactive Farm Map (simplified grid) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-4 w-4 text-terracotta" /> Farm Plot Map
            </CardTitle>
            <CardDescription>Plot colors reflect farmer status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-52 w-full overflow-hidden rounded-t-lg lg:h-64">
              {!mapError ? (
                <Map
                  initialViewState={{
                    longitude: PH_CENTER.longitude, 
                    latitude: PH_CENTER.latitude,
                    zoom: 15,
                    pitch: 60, 
                    bearing: 20,
                  }}
                  mapStyle={MAP_STYLE}
                  terrain={{ source: "terrain-source", exaggeration: 1.5 }}
                  interactive={true}
                >
                  <Source id="terrain-source" type="raster-dem" url={TERRAIN_URL} tileSize={256} />
      
                  {plotGeoJSON && (
                    <Source id="plot-data" type="geojson" data={plotGeoJSON}>
                      <Layer
                        id="plot-fills"
                        type="fill"
                        source="plot-data"
                        paint={{
                          "fill-color": [
                            "match",
                            ["get", "status"],
                            "pending", "#e4e3df", 
                            "#22c55e", 
                          ],
                          "fill-opacity": 0.9,
                        }}
                      />
                      <Layer
                        id="plot-outlines"
                        type="line"
                        source="plot-data"
                        paint={{
                          "line-color": "#ffffff",
                          "line-width": 2,
                        }}
                      />
                    </Source>
                  )}
                </Map>
              ) : (
                <MapFallback message="Map loading failed. Please check your MapTiler API key." />
              )}
              
              {!mapError && (
                <span className="absolute bottom-3 left-3 rounded-md bg-card/80 px-2 py-1 text-xs font-medium text-heading backdrop-blur z-10">
                  Cooperative Zone: Region 1
                </span>
              )}
            </div>
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              {Object.entries(statusConfig).map(([key, val]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className={`h-3 w-3 rounded-full ${val.mapColor}`} />
                  <span className="text-muted-foreground">{val.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

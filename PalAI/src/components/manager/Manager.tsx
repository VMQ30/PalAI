"use client";

import { useEffect } from "react";
import { ManagerSidebar } from "@/components/manager/ManagerSidebar";
import { CoopProfile } from "@/components/manager/ProfileView";
import { ContractInboxView } from "@/components/manager/ContractInboxView";
import { QuotaAllocationView } from "@/components/manager/QuotaAllocationView";
import { SmsHubView } from "@/components/manager/SmsHubView";
import { PayoutView } from "@/components/manager/PayoutView";
import { AiReportView } from "@/components/shared/AiReportView";
import { AiChatbot } from "@/components/shared/AiChatbot";
import { ContractAiAssistant } from "@/components/shared/ContractAiAssistant";
import { ContractProgress } from "@/components/shared/ContractProgress";
import { useAppStore } from "@/store/useAppStore";
import { DemoControlPanel } from "@/components/DemoControlPanel";
const Manager = () => {
  const activeView = useAppStore((s) => s.activeView);
  const setActiveView = useAppStore((s) => s.setActiveView);

  useEffect(() => {
    setActiveView("profile");
  }, []);

  const renderView = () => {
    switch (activeView) {
      case "profile":
        return <CoopProfile />;
      case "inbox":
        return <ContractInboxView />;
      case "ai-tracker":
        return <ContractAiAssistant />;
      case "allocation":
        return <QuotaAllocationView />;
      case "contract progress":
        return <ContractProgress />;
      case "sms-hub":
        return <SmsHubView />;
      case "payouts":
        return <PayoutView />;
      case "ai-reports":
        return <AiReportView />;
      default:
        return <CoopProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ManagerSidebar />
      <main className="ml-64 min-h-screen py-12 px-20">{renderView()}</main>
      <AiChatbot />
      <DemoControlPanel />
    </div>
  );
};

export default Manager;

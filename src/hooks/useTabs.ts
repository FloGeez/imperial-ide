import { FileSystemNode } from "@/lib/types";
import { useWebContainer } from "@/lib/webcontainer-context";
import { Tab } from "@/lib/types";
import { useState, useCallback } from "react";

export function useTabs() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const { webcontainer } = useWebContainer();

  const handleFileSelect = useCallback(
    (file: FileSystemNode) => {
      if (file.type !== "file") return;

      const existingTab = tabs.find((tab) => tab.path === file.path);
      if (existingTab) {
        setActiveTab(existingTab.id);
        return;
      }

      const newTab: Tab = {
        id: `${Date.now()}`,
        path: file.path,
        label: file.name,
        content: file.content || "",
      };

      setTabs((prev) => [...prev, newTab]);
      setActiveTab(newTab.id);
    },
    [tabs]
  );

  const handleTabClose = useCallback(
    (tabId: string) => {
      setTabs((prev) => prev.filter((tab) => tab.id !== tabId));
      if (activeTab === tabId) {
        setActiveTab(() => {
          const remainingTabs = tabs.filter((tab) => tab.id !== tabId);
          return remainingTabs.length > 0
            ? remainingTabs[remainingTabs.length - 1].id
            : "";
        });
      }
    },
    [activeTab, tabs]
  );

  const handleCodeChange = useCallback(
    async (newCode: string) => {
      if (!webcontainer) return;

      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTab ? { ...tab, content: newCode } : tab
        )
      );

      const activeTabData = tabs.find((tab) => tab.id === activeTab);
      if (activeTabData) {
        await webcontainer.fs.writeFile(activeTabData.path, newCode);
      }
    },
    [activeTab, tabs, webcontainer]
  );

  const updateTabPath = useCallback((oldPath: string, newPath: string) => {
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.path === oldPath) {
          const newName = newPath.split("/").pop() || "";
          return {
            ...tab,
            path: newPath,
            label: newName,
          };
        }
        return tab;
      })
    );
  }, []);

  return {
    tabs,
    activeTab,
    activeTabContent: tabs.find((tab) => tab.id === activeTab)?.content || "",
    handleFileSelect,
    handleTabClose,
    handleCodeChange,
    setActiveTab,
    updateTabPath,
  };
}

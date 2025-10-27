import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

// Content components
import { WelcomeContent } from './components/content/WelcomeContent';
import { OverviewContent } from './components/content/OverviewContent';
import { ThrustsContent } from './components/content/ThrustsContent';
import { RoadmapContent } from './components/content/RoadmapContent';
import { TimelineContent } from './components/content/TimelineContent';
import { DashboardContent } from './components/content/DashboardContent';
import { StoriesContent } from './components/content/StoriesContent';
import { EngageContent } from './components/content/EngageContent';
import { FinancialsContent } from './components/content/FinancialsContent';

// Admin Modals
import { UpdateInitiativeModal } from './components/UpdateInitiativeModal';
import { AddInitiativeModal } from './components/AddInitiativeModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { PasswordModal } from './components/PasswordModal';
import { KpiModal } from './components/KpiModal';
import { MediaLibraryModal } from './components/MediaLibraryModal';
import { ConfirmActionModal } from './components/ConfirmActionModal';

// Data
import { 
  initiativesData as initialInitiatives, 
  kpis as initialKpis,
  tierMilestones as initialTierMilestones, 
  strategicThrusts,
  strategicDirection as initialStrategicDirection,
  strategicObjectives as initialStrategicObjectives,
  initialSuccessStories,
  initialStoriesPageContent,
  initialEngagementChannels,
  initialEngagePageContent,
  initialWelcomePageContent
} from './data/strategicData';
import {
  financialSummaryData,
  thrustFinancialsData,
} from './data/financialData';
import type { 
  Initiative, 
  KPI,
  TierMilestone, 
  StrategicDirection, 
  StrategicObjective,
  SuccessStory,
  StoriesPageContent,
  EngagementChannel,
  EngagePageContent,
  HeaderData,
  FooterData,
  WelcomePageContent,
  FinancialSummary,
  ThrustFinancials,
} from './types';

const initialLogoSrc = '/JKR-Sarawak-SP/jkr-logo.png';
const CUSTOM_LOGO_STORAGE_KEY = 'custom-logo-src';

export function App() {
  const [activeSection, setActiveSection] = useState<string>('welcome');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Data state
  const [initiatives, setInitiatives] = useState<Initiative[]>(initialInitiatives);
  const [kpis, setKpis] = useState<KPI[]>(initialKpis);
  const [tierMilestones, setTierMilestones] = useState<TierMilestone[]>(initialTierMilestones);
  const [strategicDirection, setStrategicDirection] = useState<StrategicDirection>(initialStrategicDirection);
  const [strategicObjectives, setStrategicObjectives] = useState<StrategicObjective[]>(initialStrategicObjectives);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>(initialSuccessStories);
  const [storiesPageContent, setStoriesPageContent] = useState<StoriesPageContent>(initialStoriesPageContent);
  const [engagementChannels, setEngagementChannels] = useState<EngagementChannel[]>(initialEngagementChannels);
  const [engagePageContent, setEngagePageContent] = useState<EngagePageContent>(initialEngagePageContent);
  const [headerData, setHeaderData] = useState<HeaderData>({ mainTitle: "JKR Sarawak Strategic Plan", tagline: "We Build For You", headerLink: "https://jkr.sarawak.gov.my" });
  const [footerData, setFooterData] = useState<FooterData>({ tagline: "JKR Sarawak: Leading Engineering Agency in Sarawak", links: [{ text: "JKR Sarawak Website", href: "https://jkr.sarawak.gov.my" }, { text: "Contact Us", href: "#" }], copyright: "© 2025 JKR Sarawak. All rights reserved." });
  const [welcomePageContent, setWelcomePageContent] = useState<WelcomePageContent>(initialWelcomePageContent);
  const [logoSrc, setLogoSrc] = useState<string>(() => {
    try {
      return localStorage.getItem(CUSTOM_LOGO_STORAGE_KEY) || initialLogoSrc;
    } catch (error) {
      console.error("Could not read logo from local storage", error);
      return initialLogoSrc;
    }
  });
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>(financialSummaryData);
  const [thrustFinancials, setThrustFinancials] = useState<ThrustFinancials[]>(thrustFinancialsData);

  
  // Modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [deletingInitiative, setDeletingInitiative] = useState<Initiative | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addingToThrustId, setAddingToThrustId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingKpiInfo, setEditingKpiInfo] = useState<{ index: number | null, kpi: KPI | null, isNew: boolean } | null>(null);
  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [mediaLibraryCallback, setMediaLibraryCallback] = useState<(url: string) => void>(() => () => {});

  // Theme toggling effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Scroll to top when section changes for tabbed navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);
  
  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

  const toggleAdminMode = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
    } else {
      setIsPasswordModalOpen(true);
    }
  };
  
  const handleAdminLoginSuccess = () => {
    setIsAdminMode(true);
    setIsPasswordModalOpen(false);
  };
  
  // --- Data CRUD handlers ---
  const handleUpdateInitiative = useCallback((initiativeId: string, updates: Partial<Initiative>) => {
    setInitiatives(prev => 
      prev.map(i => i.id === initiativeId ? { ...i, ...updates } : i)
    );
  }, []);
  
  const handleAddInitiative = useCallback((newInitiativeData: Omit<Initiative, 'id'>) => {
    setInitiatives(prev => {
        const thrustInitiatives = prev.filter(i => i.thrustId === newInitiativeData.thrustId);
        const maxSeq = thrustInitiatives.reduce((max, i) => {
            const seq = parseInt(i.id.split('.')[1], 10);
            return !isNaN(seq) && seq > max ? seq : max;
        }, 0);
        const newId = `I-${newInitiativeData.thrustId}.${maxSeq + 1}`;

        const newInitiative: Initiative = {
            id: newId,
            ...newInitiativeData,
        };
        return [...prev, newInitiative].sort((a,b) => a.id.localeCompare(b.id));
    });
  }, []);

  const handleDeleteInitiative = useCallback((initiativeId: string) => {
    setInitiatives(prev => prev.filter(i => i.id !== initiativeId));
  }, []);

  const handleUpdateKpi = useCallback((index: number, updatedKpi: KPI) => {
      setKpis(prev => prev.map((kpi, i) => i === index ? updatedKpi : kpi));
  }, []);

  const handleAddKpi = useCallback(() => {
      const newKpi: KPI = { 
          name: "New KPI",
          target: "Set Target",
          current: "Set Current",
          targetValue: 100,
          currentValue: 0,
      };
      setKpis(prevKpis => {
        const updatedKpis = [...prevKpis, newKpi];
        setEditingKpiInfo({ index: updatedKpis.length - 1, kpi: newKpi, isNew: true });
        setIsKpiModalOpen(true);
        return updatedKpis;
      });
  }, []);

  const handleDeleteKpi = useCallback((index: number) => {
      setKpis(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  const handleOpenKpiModal = useCallback((index: number) => {
      setEditingKpiInfo({ index, kpi: kpis[index], isNew: false });
      setIsKpiModalOpen(true);
  }, [kpis]);

  const handleSaveKpiModal = useCallback((updatedKpi: KPI) => {
    if (editingKpiInfo?.isNew) {
      setKpis(prev => [...prev.slice(0, -1), updatedKpi]);
    } else if (editingKpiInfo?.index !== null && editingKpiInfo?.index !== undefined) {
      handleUpdateKpi(editingKpiInfo.index, updatedKpi);
    }
    setIsKpiModalOpen(false);
    setEditingKpiInfo(null);
  }, [editingKpiInfo, handleUpdateKpi]);
  
  const handleUpdateMilestone = useCallback((tierIndex: number, milestoneIndex: number, newText: string) => {
    setTierMilestones(prev => {
      const newTiers = JSON.parse(JSON.stringify(prev));
      newTiers[tierIndex].milestones[milestoneIndex] = newText;
      return newTiers;
    });
  }, []);

  const handleDeleteMilestone = useCallback((tierIndex: number, milestoneIndex: number) => {
    setTierMilestones(prev => {
      const newTiers = JSON.parse(JSON.stringify(prev));
      newTiers[tierIndex].milestones.splice(milestoneIndex, 1);
      return newTiers;
    });
  }, []);

  const handleAddMilestone = useCallback((tierIndex: number, newText: string) => {
    setTierMilestones(prev => {
      const newTiers = JSON.parse(JSON.stringify(prev));
      newTiers[tierIndex].milestones.push(newText);
      return newTiers;
    });
  }, []);

  const handleUpdateDirection = useCallback((field: keyof StrategicDirection, value: string) => {
    setStrategicDirection(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleUpdateObjective = useCallback((id: number, field: 'title' | 'description' | 'imgSrc', value: string) => {
    setStrategicObjectives(prev => prev.map(obj => obj.id === id ? { ...obj, [field]: value } : obj));
  }, []);
  
  const handleUpdateStory = useCallback((id: number, field: keyof Omit<SuccessStory, 'id' | 'gradient'>, value: string) => {
    setSuccessStories(prev => prev.map(story => story.id === id ? { ...story, [field]: value } : story));
  }, []);

  const handleUpdateStoriesPageContent = useCallback((field: keyof StoriesPageContent, value: string) => {
    setStoriesPageContent(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const handleAddStory = useCallback(() => {
    setSuccessStories(prev => {
        const newId = Math.max(0, ...prev.map(s => s.id)) + 1;
        const newStory: SuccessStory = {
          id: newId,
          title: 'New Success Story',
          subtitle: 'A brief, catchy subtitle',
          description: 'Describe the impact and success of this project or initiative.',
          gradient: 'from-gray-400 to-gray-500',
          href: '#',
          buttonText: 'Watch Episode',
        };
        return [...prev, newStory];
    });
  }, []);
  
  const handleDeleteStory = useCallback((id: number) => {
    setSuccessStories(prev => prev.filter(story => story.id !== id));
  }, []);
  
  const handleUpdateChannel = useCallback((id: number, field: keyof Omit<EngagementChannel, 'id' | 'icon' | 'color' | 'buttonColor'>, value: string) => {
    setEngagementChannels(prev => prev.map(channel => channel.id === id ? { ...channel, [field]: value } : channel));
  }, []);
  
  const handleUpdateEngagePageContent = useCallback((field: keyof Omit<EngagePageContent, 'governanceInitiatives' | 'mediaInitiatives'>, value: string) => {
     setEngagePageContent(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const handleUpdateEngageInitiativeText = useCallback((section: 'governance' | 'media', id: number, value: string, field: 'strong' | 'text') => {
      const key = section === 'governance' ? 'governanceInitiatives' : 'mediaInitiatives';
      setEngagePageContent(prev => ({
          ...prev,
          [key]: prev[key].map(item => item.id === id ? { ...item, [field]: value } : item)
      }));
  }, []);
  
  const handleUpdateHeader = useCallback((field: keyof HeaderData, value: string) => {
    setHeaderData(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const handleUpdateFooter = useCallback((field: 'tagline' | 'copyright' | 'linkText' | 'linkHref', value: string, linkIndex?: number) => {
    if (field === 'linkText' || field === 'linkHref') {
      setFooterData(prev => ({
        ...prev,
        links: prev.links.map((link, index) => 
          index === linkIndex ? { ...link, [field === 'linkText' ? 'text' : 'href']: value } : link
        )
      }));
    } else {
      setFooterData(prev => ({ ...prev, [field]: value }));
    }
  }, []);

  const handleUpdateWelcomePageContent = useCallback((field: keyof WelcomePageContent, value: string) => {
    setWelcomePageContent(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleUpdateFinancialSummary = useCallback((field: keyof FinancialSummary, value: string | number) => {
    setFinancialSummary(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleUpdateThrustFinancial = useCallback((id: number, field: 'budget' | 'spending', value: number) => {
    setThrustFinancials(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
    
    // Recalculate summary
    const updatedThrusts = thrustFinancials.map(t => t.id === id ? { ...t, [field]: value } : t);
    const totalBudget = updatedThrusts.reduce((acc, curr) => acc + curr.budget, 0);
    const totalSpending = updatedThrusts.reduce((acc, curr) => acc + curr.spending, 0);
    setFinancialSummary(prev => ({ ...prev, budget: totalBudget, spending: totalSpending }));
  }, [thrustFinancials]);

  const handleResetAllProgress = useCallback(() => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const resetNote = `[${timestamp}] Progress reset to 0% by Admin.`;

    setInitiatives(prev => prev.map(i => ({
        ...i,
        progress: 0,
        actual_start: '', // Reset actual start date as progress is 0
        actual_end: '',   // Reset actual end date as progress is 0
        notes: i.notes ? `${resetNote}\n-------------------\n${i.notes}` : resetNote
    })));
  }, []);

  
  const handleOpenMediaLibrary = useCallback((callback?: (url: string) => void) => {
    if (callback) {
      setMediaLibraryCallback(() => callback);
    } else {
      setMediaLibraryCallback(() => () => {});
    }
    setIsMediaLibraryOpen(true);
  }, []);

  const handleSelectImage = (url: string) => {
    mediaLibraryCallback(url);
    setIsMediaLibraryOpen(false);
  };
  
  const handleUpdateLogo = useCallback((src: string) => {
    setLogoSrc(src);
    localStorage.setItem(CUSTOM_LOGO_STORAGE_KEY, src);
  }, []);
  
  const handleResetLogo = useCallback(() => {
    setLogoSrc(initialLogoSrc);
    localStorage.removeItem(CUSTOM_LOGO_STORAGE_KEY);
  }, []);
  
  // --- Modal opening handlers ---
  const handleEditInitiative = useCallback((initiative: Initiative) => {
    setEditingInitiative(initiative);
    setIsUpdateModalOpen(true);
  }, []);

  const confirmDeleteInitiative = useCallback((initiativeId: string) => {
    const initiativeToDelete = initiatives.find(i => i.id === initiativeId);
    if (initiativeToDelete) {
        setDeletingInitiative(initiativeToDelete);
        setIsDeleteModalOpen(true);
    }
  }, [initiatives]);
  
  const handleOpenAddInitiativeModal = useCallback((thrustId: number) => {
    setAddingToThrustId(thrustId);
    setIsAddModalOpen(true);
  }, []);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'welcome':
        return <WelcomeContent isAdminMode={isAdminMode} pageContent={welcomePageContent} onUpdatePageContent={handleUpdateWelcomePageContent} logoSrc={logoSrc} />;
      case 'overview':
        return <OverviewContent isAdminMode={isAdminMode} direction={strategicDirection} objectives={strategicObjectives} onUpdateDirection={handleUpdateDirection} onUpdateObjective={handleUpdateObjective} onOpenMediaLibrary={handleOpenMediaLibrary} />;
      case 'thrusts':
        return <ThrustsContent isAdminMode={isAdminMode} onEditInitiative={handleEditInitiative} onDeleteInitiative={confirmDeleteInitiative} onAddInitiative={handleOpenAddInitiativeModal} initiatives={initiatives} />;
      case 'roadmap':
        return <RoadmapContent isAdminMode={isAdminMode} milestones={tierMilestones} onUpdateMilestone={handleUpdateMilestone} onDeleteMilestone={handleDeleteMilestone} onAddMilestone={handleAddMilestone} />;
      case 'timeline':
        return <TimelineContent initiatives={initiatives} isAdminMode={isAdminMode} onEditInitiative={handleEditInitiative} />;
      case 'dashboard':
        return <DashboardContent initiatives={initiatives} kpis={kpis} strategicThrusts={strategicThrusts} isAdminMode={isAdminMode} onEditInitiative={handleEditInitiative} onDeleteInitiative={confirmDeleteInitiative} onAddKpi={handleAddKpi} onEditKpi={handleOpenKpiModal} onDeleteKpi={handleDeleteKpi} onResetAllProgress={handleResetAllProgress} />;
      case 'financials':
        return <FinancialsContent isAdminMode={isAdminMode} summary={financialSummary} thrustData={thrustFinancials} objectives={strategicObjectives} onUpdateSummary={handleUpdateFinancialSummary} onUpdateThrust={handleUpdateThrustFinancial} />;
      case 'stories':
        return <StoriesContent isAdminMode={isAdminMode} stories={successStories} pageContent={storiesPageContent} onUpdateStory={handleUpdateStory} onUpdatePageContent={handleUpdateStoriesPageContent} onAddStory={handleAddStory} onDeleteStory={handleDeleteStory} />;
      case 'engage':
        return <EngageContent isAdminMode={isAdminMode} channels={engagementChannels} pageContent={engagePageContent} onUpdateChannel={handleUpdateChannel} onUpdatePageContent={handleUpdateEngagePageContent} onUpdateInitiativeText={handleUpdateEngageInitiativeText} onOpenMediaLibrary={handleOpenMediaLibrary} />;
      default:
        return <WelcomeContent isAdminMode={isAdminMode} pageContent={welcomePageContent} onUpdatePageContent={handleUpdateWelcomePageContent} logoSrc={logoSrc} />;
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors ${isAdminMode ? 'admin-mode' : ''}`}>
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        isAdminMode={isAdminMode} 
        toggleAdminMode={toggleAdminMode} 
        data={headerData}
        onUpdate={handleUpdateHeader}
        logoSrc={logoSrc}
        onOpenMediaLibrary={handleOpenMediaLibrary}
        onUpdateLogo={handleUpdateLogo}
        onResetLogo={handleResetLogo}
      />
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveSection()}
      </main>
      <Footer isAdminMode={isAdminMode} data={footerData} onUpdate={handleUpdateFooter} />

      {/* Modals */}
      <PasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} onSuccess={handleAdminLoginSuccess} onFailure={() => {}} />
      <UpdateInitiativeModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} onSave={handleUpdateInitiative} initiative={editingInitiative} initiatives={initiatives} />
      <AddInitiativeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddInitiative} thrustId={addingToThrustId} initiatives={initiatives}/>
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => deletingInitiative && handleDeleteInitiative(deletingInitiative.id)} initiative={deletingInitiative} />
      <KpiModal isOpen={isKpiModalOpen} onClose={() => { setIsKpiModalOpen(false); setEditingKpiInfo(null); if (editingKpiInfo?.isNew) { setKpis(prev => prev.slice(0, -1)); } }} onSave={handleSaveKpiModal} kpiInfo={editingKpiInfo} initiatives={initiatives} />
      <MediaLibraryModal isOpen={isMediaLibraryOpen} onClose={() => setIsMediaLibraryOpen(false)} onSelectImage={handleSelectImage} />
    </div>
  );
}
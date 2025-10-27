
import React, { useState, Fragment, useMemo, useEffect } from 'react';
import { Download, Loader2, X, CheckSquare, Square, CheckCircle, Eye, DownloadCloud } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import { navItems, strategicThrusts } from '../data/strategicData';

// Import all data sources needed for print components
import { 
    initiativesData, 
    kpis as initialKpis,
    tierMilestones,
    strategicDirection,
    strategicObjectives,
} from '../data/strategicData';
import type { KPI, Initiative, StrategicThrust, StrategicDirection, StrategicObjective, TierMilestone } from '../types';


// Extend the Window interface for TypeScript to recognize the libraries
declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}


// #region Print-friendly Components
// These are simplified components to ensure html2canvas can render them reliably.

const PrintOverviewContent: React.FC<{ direction: StrategicDirection, objectives: StrategicObjective[], strategicThrusts: StrategicThrust[] }> = ({ direction, objectives, strategicThrusts }) => (
    <div style={{ padding: '24px', backgroundColor: '#ffffff', fontFamily: 'sans-serif', color: '#111827' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px', color: '#111827' }}>Strategic Plan Overview</h2>
        
        <div style={{ pageBreakInside: 'avoid', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>Our Strategic Direction</h3>
            <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>Vision</h4>
                <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{direction.vision}</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>Mission</h4>
                <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{direction.mission}</p>
            </div>
            <div>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>Goal</h4>
                <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{direction.goal}</p>
            </div>
        </div>
        
        <div style={{ pageBreakInside: 'avoid', marginBottom: '24px', breakBefore: 'page' }}>
             <h3 style={{ fontSize: '20px', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>Our 4 Strategic Objectives</h3>
             {objectives.map(obj => (
                 <div key={obj.id} style={{ marginBottom: '16px', pageBreakInside: 'avoid' }}>
                     <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>{obj.title}</h4>
                     <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#475569', marginBottom: '8px' }}>{obj.description}</p>
                     <ul style={{ listStyleType: 'disc', paddingLeft: '20px', fontSize: '12px' }}>
                         {obj.thrusts.map((thrustId: number) => {
                            const thrust = strategicThrusts.find(t => t.id === thrustId);
                            return <li key={thrustId}><strong>T{thrustId}:</strong> {thrust?.title}</li>;
                         })}
                     </ul>
                 </div>
             ))}
        </div>

        <div style={{ pageBreakInside: 'avoid', breakBefore: 'page' }}>
             <h3 style={{ fontSize: '20px', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>Our 12 Strategic Thrusts at a Glance</h3>
             {strategicThrusts.map(thrust => (
                 <div key={thrust.id} style={{ marginBottom: '12px', pageBreakInside: 'avoid' }}>
                     <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>Thrust {thrust.id}: {thrust.title}</h4>
                     <p style={{ fontSize: '14px', color: '#475569' }}>{thrust.description}</p>
                 </div>
             ))}
        </div>
    </div>
);

const PrintThrustsContent: React.FC<{ initiatives: Initiative[], strategicThrusts: StrategicThrust[] }> = ({ initiatives, strategicThrusts }) => {
    const initiativesByThrust = initiatives.reduce((acc, initiative) => {
        if (!acc[initiative.thrustId]) acc[initiative.thrustId] = [];
        acc[initiative.thrustId].push(initiative);
        return acc;
    }, {} as Record<number, any[]>);

    return (
        <div style={{ padding: '24px', backgroundColor: '#ffffff', fontFamily: 'sans-serif', color: '#111827' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>The 12 Strategic Thrusts & Initiatives</h2>
            {strategicThrusts.map(thrust => (
                <div key={thrust.id} style={{ marginBottom: '24px', pageBreakInside: 'avoid', breakBefore: 'page' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
                        Thrust {thrust.id}: {thrust.title}
                    </h3>
                    <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#475569', marginBottom: '16px' }}>{thrust.description}</p>
                    {(initiativesByThrust[thrust.id] || []).map(initiative => (
                        <div key={initiative.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '12px', backgroundColor: 'white', pageBreakInside: 'avoid' }}>
                            <p style={{ fontWeight: 700, fontSize: '14px' }}>{initiative.id}: {initiative.name}</p>
                            <div style={{ fontSize: '12px', color: '#475569', marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <p><strong>Timeline:</strong> {initiative.start} - {initiative.end}</p>
                                <p><strong>Tier:</strong> {initiative.tier || 'N/A'}</p>
                                <p><strong>Branch:</strong> {initiative.responsibleBranch || 'N/A'}</p>
                                <p><strong>Progress:</strong> {initiative.progress}%</p>
                            </div>
                             {initiative.expectedOutcome && <p style={{ fontSize: '12px', marginTop: '8px' }}><strong>Expected Outcome:</strong> {initiative.expectedOutcome}</p>}
                             {initiative.remarks && <p style={{ fontSize: '12px', marginTop: '8px' }}><strong>Remarks:</strong> {initiative.remarks}</p>}
                        </div>
                    ))}
                    {(initiativesByThrust[thrust.id] || []).length === 0 && (
                        <p style={{ fontSize: '12px', color: '#64748b' }}>No initiatives for this thrust.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

const PrintRoadmapContent: React.FC<{ milestones: TierMilestone[] }> = ({ milestones }) => (
    <div style={{ padding: '24px', backgroundColor: '#ffffff', fontFamily: 'sans-serif', color: '#111827' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>Implementation Roadmap: Tier Milestones</h2>
        {milestones.map(tier => (
            <div key={tier.tier} style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
                    {tier.tier}
                </h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '24px', fontSize: '14px', lineHeight: 1.6 }}>
                    {tier.milestones.map((milestone: string, index: number) => (
                        <li key={index} style={{ marginBottom: '8px' }}>{milestone}</li>
                    ))}
                </ul>
            </div>
        ))}
    </div>
);
// #endregion

// Map section IDs to their corresponding print-friendly components
const sectionPrintComponentMap: Record<string, React.ComponentType<any>> = {
  'overview': PrintOverviewContent,
  'thrusts': PrintThrustsContent,
  'roadmap': PrintRoadmapContent,
};

// A helper to get the necessary props for each content component
const getComponentProps = (sectionId: string) => {
    switch (sectionId) {
        case 'overview':
            return { direction: strategicDirection, objectives: strategicObjectives, strategicThrusts: strategicThrusts };
        case 'thrusts':
            return { initiatives: initiativesData, strategicThrusts: strategicThrusts };
        case 'roadmap':
            return { milestones: tierMilestones };
        default:
            return {};
    }
};

const downloadableNavItems = navItems.filter(item => 
  ['overview', 'thrusts', 'roadmap'].includes(item.id)
);

export const PDFDownloadButton: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSections, setSelectedSections] = useState(() => new Set(downloadableNavItems.map(item => item.id)));
  const [progressMessage, setProgressMessage] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup effect to revoke the object URL when the component unmounts or the URL changes, preventing memory leaks.
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleToggleSection = (sectionId: string) => {
    setSelectedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) newSet.delete(sectionId);
      else newSet.add(sectionId);
      return newSet;
    });
  };

  const handleSelectAll = () => setSelectedSections(new Set(downloadableNavItems.map(item => item.id)));
  const handleDeselectAll = () => setSelectedSections(new Set());

  const handleCloseAndReset = () => {
    setIsModalOpen(false);
    setTimeout(() => {
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }
        setPdfUrl(null);
        setIsDownloading(false);
        setProgressMessage('');
    }, 300);
  };

  const handleGenerate = async () => {
    if (!window.html2canvas || !window.jspdf) {
      alert("PDF generation libraries are not loaded yet. Please try again in a moment.");
      return;
    }
    if (selectedSections.size === 0) {
      alert("Please select at least one section to include in the PDF.");
      return;
    }

    setIsDownloading(true);
    setProgressMessage('Initializing PDF...');

    let printContainer: HTMLDivElement | null = null;
    let root: ReturnType<typeof createRoot> | null = null;

    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 40;
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = pdfHeight - margin * 2;
      
      const sectionsToRender = downloadableNavItems.filter(item => selectedSections.has(item.id));
      let isFirstPage = true;

      printContainer = document.createElement('div');
      printContainer.style.position = 'absolute';
      printContainer.style.left = '-9999px';
      printContainer.style.width = '1056px'; // A4 width at 96 DPI
      document.body.appendChild(printContainer);
      root = createRoot(printContainer);

      const addHeaderAndFooter = (page: number, totalPages: number, title: string) => {
        pdf.setFontSize(8);
        pdf.text('JKR Sarawak Strategic Plan 2025-2030', margin, 20);
        pdf.text(title, pdfWidth / 2, 20, { align: 'center' });
        pdf.text(`Page ${page} of ${totalPages}`, pdfWidth - margin, pdfHeight - 20, { align: 'right' });
      };

      for (let i = 0; i < sectionsToRender.length; i++) {
        const section = sectionsToRender[i];
        setProgressMessage(`Processing section ${i + 1}/${sectionsToRender.length}: ${section.label}`);
        
        if (!isFirstPage) {
          pdf.addPage();
        } else {
          isFirstPage = false;
        }
        
        try {
            const Component = sectionPrintComponentMap[section.id];
            if (!Component) {
                console.warn(`No print component defined for section: ${section.id}`);
                continue;
            }

            const componentProps = getComponentProps(section.id);
            
            await new Promise<void>(resolve => {
                root.render(<Component {...componentProps} />);
                // Wait for component to render. Increased for stability.
                setTimeout(resolve, 2000); 
            });

            const canvas = await window.html2canvas(printContainer, { scale: 1.5, useCORS: true, logging: false });
            
            if (!canvas || canvas.width === 0 || canvas.height === 0) {
                throw new Error(`Canvas for section "${section.label}" is empty or invalid.`);
            }

            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const ratio = imgProps.width / contentWidth;
            const scaledHeight = imgProps.height / ratio;
            
            let position = 0;
            pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, scaledHeight);
            let heightLeft = scaledHeight - contentHeight;

            while (heightLeft > 0) {
                position -= contentHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position + margin, contentWidth, scaledHeight);
                heightLeft -= contentHeight;
            }
        } catch (sectionError) {
            console.error(`Failed to render section "${section.label}":`, sectionError);
            pdf.setTextColor(255, 0, 0);
            pdf.text("This section could not be rendered due to a complex content error.", margin, margin + 20);
            pdf.setTextColor(0, 0, 0);
        }
      }

      setProgressMessage('Finalizing document...');
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          addHeaderAndFooter(i, totalPages, 'Strategic Plan Report');
      }

      const pdfBlob = pdf.output('blob');
      if (!pdfBlob || pdfBlob.size === 0) {
          throw new Error("Generated PDF Blob is empty or invalid.");
      }
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      window.open(url, '_blank'); // Open the generated PDF in a new tab

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(`An unexpected error occurred while generating the PDF. ${error instanceof Error ? error.message : ''}`);
      handleCloseAndReset();
    } finally {
      if (root) {
        root.unmount();
      }
      if(printContainer && document.body.contains(printContainer)) {
         document.body.removeChild(printContainer);
      }
      setProgressMessage('Compilation Complete!');
      setIsDownloading(false);
    }
  };

  return (
    <Fragment>
      <button
        id="pdf-download-button"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
        aria-label="Download page as PDF"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Download PDF</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Customize PDF Report</h3>
              {(!isDownloading && !pdfUrl) && <button onClick={handleCloseAndReset} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>}
            </div>
            
            <div className="min-h-[250px] flex flex-col justify-center">
              {isDownloading ? (
                  <div className="p-10 flex flex-col items-center justify-center text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-red-500 mb-4" />
                      <p className="font-semibold text-gray-800 dark:text-slate-200">Generating your report...</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{progressMessage}</p>
                  </div>
              ) : pdfUrl ? (
                  <div className="p-10 flex flex-col items-center justify-center text-center">
                      <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-slate-200">Report Ready!</h4>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Your PDF report has opened in a new tab.</p>
                  </div>
              ) : (
                  <div className="p-6">
                    <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">Select the sections to include in your PDF document.</p>
                    <div className="flex justify-between mb-4">
                        <button onClick={handleSelectAll} className="text-xs font-semibold text-blue-600 hover:underline">Select All</button>
                        <button onClick={handleDeselectAll} className="text-xs font-semibold text-blue-600 hover:underline">Deselect All</button>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {downloadableNavItems.map(item => (
                        <label key={item.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer">
                          <input type="checkbox" className="hidden" checked={selectedSections.has(item.id)} onChange={() => handleToggleSection(item.id)} />
                          {selectedSections.has(item.id) ? <CheckSquare className="w-5 h-5 text-red-600" /> : <Square className="w-5 h-5 text-gray-400 dark:text-gray-500" />}
                          <span className="text-gray-800 dark:text-slate-200">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
              )}
            </div>
            
            <div className="flex justify-end p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 rounded-b-xl">
              {isDownloading ? null : pdfUrl ? (
                <div className="flex justify-between items-center w-full">
                    <button onClick={handleCloseAndReset} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600">
                      Close
                    </button>
                    <div className="flex items-center space-x-2">
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            <span>View Again</span>
                        </a>
                         <a
                          href={pdfUrl}
                          download="JKR-Sarawak-Strategic-Plan-Report.pdf"
                          className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                        >
                            <DownloadCloud className="w-4 h-4" />
                            <span>Download</span>
                        </a>
                    </div>
                </div>
              ) : (
                <Fragment>
                  <button onClick={handleCloseAndReset} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 mr-2">
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={selectedSections.size === 0}
                    className="flex items-center justify-center space-x-2 w-36 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <span>Generate PDF</span>
                  </button>
                </Fragment>
              )}
            </div>

          </div>
        </div>
      )}
    </Fragment>
  );
};

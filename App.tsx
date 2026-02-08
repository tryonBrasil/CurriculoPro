
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ResumeData, TemplateId, Experience, Education, Skill, Language, Course } from './types';
import { INITIAL_RESUME_DATA, MOCK_RESUME_DATA } from './constants';
import Input from './components/Input';
import ResumePreview from './components/ResumePreview';
import PhotoCropModal from './components/PhotoCropModal';
import { enhanceText, generateSummary, suggestSkills } from './services/geminiService';

declare var adsbygoogle: any;

const AdBanner: React.FC = () => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          (window as any).adsbygoogle.push({});
        }
      } catch (e) {
        console.warn('AdSense deferred error:', e);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="no-print my-8 overflow-hidden flex justify-center w-full bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200 min-h-[100px]">
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%', minWidth: '250px' }}
           data-ad-client="ca-pub-1895006161330485"
           data-ad-slot="4202937333"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
};

const STEPS = [
  { id: 'info', label: 'Dados', icon: 'fa-id-card' },
  { id: 'experience', label: 'Experiência', icon: 'fa-briefcase' },
  { id: 'education', label: 'Educação', icon: 'fa-graduation-cap' },
  { id: 'skills', label: 'Habilidades', icon: 'fa-bolt' },
  { id: 'extras', label: 'Extras', icon: 'fa-plus-circle' },
  { id: 'summary', label: 'Resumo', icon: 'fa-align-left' },
];

const TEMPLATES = [
  { id: 'modern_blue', label: 'Modern Blue', color: 'bg-[#1e40af]', desc: 'Profissional e Limpo' },
  { id: 'executive_navy', label: 'Executive Navy', color: 'bg-[#0c1221]', desc: 'Premium e Luxuoso' },
  { id: 'modern_vitae', label: 'Modern Vitae', color: 'bg-[#f1f5f9]', desc: 'Elegante e Espaçoso' },
  { id: 'classic_serif', label: 'Classic Serif', color: 'bg-[#1a1a1a]', desc: 'Tradicional Acadêmico' },
  { id: 'swiss_minimal', label: 'Swiss Minimal', color: 'bg-[#f8fafc]', desc: 'Design Suíço' },
  { id: 'teal_sidebar', label: 'Teal Sidebar', color: 'bg-[#2D4F4F]', desc: 'Corporativo Moderno' },
  { id: 'executive_red', label: 'Executive Red', color: 'bg-[#800000]', desc: 'Liderança Sênior' },
  { id: 'corporate_gray', label: 'Corporate Gray', color: 'bg-[#334155]', desc: 'Minimalista Pro' },
  { id: 'minimal_red_line', label: 'Minimal Red', color: 'bg-[#D32F2F]', desc: 'Impacto Visual' },
];

type AppView = 'home' | 'editor';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [data, setData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [template, setTemplate] = useState<TemplateId>('modern_blue');
  const [currentStep, setCurrentStep] = useState(0);
  const [previewScale, setPreviewScale] = useState(0.55);
  const [isEnhancing, setIsEnhancing] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [highlightedStep, setHighlightedStep] = useState<string | null>(null);
  
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const editorScrollRef = useRef<HTMLDivElement>(null);

  const cvScore = useMemo(() => {
    let points = 0;
    if (data.personalInfo.fullName) points += 15;
    if (data.personalInfo.jobTitle) points += 10;
    if (data.summary && data.summary.length > 50) points += 15;
    if (data.experiences && data.experiences.length > 0) points += 20;
    if (data.education && data.education.length > 0) points += 15;
    if (data.skills && data.skills.length >= 3) points += 10;
    if (data.languages && data.languages.length > 0) points += 5;
    if (data.courses && data.courses.length > 0) points += 10;
    return Math.min(points, 100);
  }, [data]);

  const activeTab = STEPS[currentStep].id;

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropConfirm = (croppedImage: string) => {
    updatePersonalInfo('photoUrl', croppedImage);
    setIsCropModalOpen(false);
    setTempImage(null);
  };

  const addItem = (listName: 'experiences' | 'education' | 'skills' | 'languages' | 'courses') => {
    const id = Math.random().toString(36).substr(2, 9);
    if (listName === 'experiences') {
      const newItem: Experience = { id, company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' };
      setData(prev => ({ ...prev, experiences: [newItem, ...(prev.experiences || [])] }));
    } else if (listName === 'education') {
      const newItem: Education = { id, institution: '', degree: '', field: '', location: '', startDate: '', endDate: '' };
      setData(prev => ({ ...prev, education: [newItem, ...(prev.education || [])] }));
    } else if (listName === 'skills') {
      const newItem: Skill = { id, name: '', level: 'Intermediate' };
      setData(prev => ({ ...prev, skills: [...(prev.skills || []), newItem] }));
    } else if (listName === 'languages') {
      const newItem: Language = { id, name: '', level: '', percentage: 60 };
      setData(prev => ({ ...prev, languages: [...(prev.languages || []), newItem] }));
    } else if (listName === 'courses') {
      const newItem: Course = { id, name: '', institution: '', year: '' };
      setData(prev => ({ ...prev, courses: [...(prev.courses || []), newItem] }));
    }
  };

  const removeItem = (listName: 'experiences' | 'education' | 'skills' | 'languages' | 'courses', id: string) => {
    setData(prev => ({
      ...prev,
      [listName]: (prev[listName] as any[]).filter(item => item.id !== id)
    }));
  };

  const updateItem = (listName: 'experiences' | 'education' | 'skills' | 'languages' | 'courses', id: string, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [listName]: (prev[listName] as any[]).map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleEnhance = async (text: string, context: string, listName?: any, id?: string) => {
    if (!text || isEnhancing) return;
    setIsEnhancing(id || context);
    try {
      const enhanced = await enhanceText(text, context);
      if (listName && id) {
        updateItem(listName, id, 'description', enhanced);
      } else if (context === 'summary') {
        setData(prev => ({ ...prev, summary: enhanced }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(null);
    }
  };

  const handleGenerateSummary = async () => {
    if (!data.personalInfo.jobTitle || isEnhancing) return;
    setIsEnhancing('summary-gen');
    try {
      const skillNames = data.skills.map(s => s.name);
      const expPositions = data.experiences.map(e => e.position);
      const generated = await generateSummary(data.personalInfo.jobTitle, skillNames, expPositions);
      setData(prev => ({ ...prev, summary: generated }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(null);
    }
  };

  const handleSectionClick = (sectionId: string) => {
    const index = STEPS.findIndex(step => step.id === sectionId);
    if (index !== -1) {
      setCurrentStep(index);
      setHighlightedStep(sectionId);
      
      // Feedback visual temporário
      setTimeout(() => setHighlightedStep(null), 1000);

      // Rolagem suave para o topo do editor
      if (editorScrollRef.current) {
        editorScrollRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  };

  const resetZoom = () => {
    if (!previewContainerRef.current) return;
    const containerHeight = previewContainerRef.current.clientHeight;
    const containerWidth = previewContainerRef.current.clientWidth;
    const scaleY = (containerHeight - 80) / 1123;
    const scaleX = (containerWidth - 80) / 794; 
    const bestScale = Math.min(scaleX, scaleY);
    setPreviewScale(Math.min(1.0, Math.max(0.3, bestScale)));
  };

  useEffect(() => {
    if (view === 'editor') {
      resetZoom();
      const timer = setTimeout(resetZoom, 300);
      window.addEventListener('resize', resetZoom);
      return () => {
        window.removeEventListener('resize', resetZoom);
        clearTimeout(timer);
      };
    }
  }, [view, isSidebarOpen]);

  if (view === 'home') {
    return (
      <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] aspect-square bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] aspect-square bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
        
        <header className="relative z-10 h-24 flex items-center justify-between px-8 md:px-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 rotate-3">
               <i className="fas fa-file-invoice text-lg"></i>
            </div>
            <h1 className="font-black text-2xl tracking-tighter text-slate-800 uppercase italic">Curriculo<span className="text-blue-600">BR</span></h1>
          </div>
          <button 
            onClick={() => { setData(MOCK_RESUME_DATA); setView('editor'); }}
            className="hidden md:block text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
          >
            Ver Exemplo
          </button>
        </header>

        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-24 text-center">
          <div className="max-w-5xl w-full space-y-8">
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
              <span className="inline-block py-2 px-4 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Profissional & Elegante
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none">
                Seu currículo perfeito, <br className="hidden md:block"/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">simples e direto.</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                Design de alto nível para destacar suas habilidades. 
                Construído para profissionais que buscam o próximo nível na carreira.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <button 
                onClick={() => { setData(INITIAL_RESUME_DATA); setView('editor'); }}
                className="group bg-slate-900 text-white px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:scale-[1.05] transition-all shadow-2xl flex items-center gap-3"
              >
                Criar Meu Currículo <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>

            <div className="pt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 animate-in fade-in duration-1000 delay-500 px-4">
              {TEMPLATES.slice(0, 5).map(t => (
                <div key={t.id} className="group relative cursor-pointer" onClick={() => { setTemplate(t.id as TemplateId); setView('editor'); }}>
                  <div className={`w-full aspect-[3/4] ${t.color} rounded-2xl shadow-lg group-hover:-translate-y-2 transition-transform duration-500 flex items-center justify-center overflow-hidden border border-slate-100`}>
                    <div className="w-1/2 h-full bg-white/10 backdrop-blur-[2px] -skew-x-12 translate-x-10"></div>
                  </div>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">{t.label}</p>
                </div>
              ))}
            </div>

            <AdBanner />
          </div>
        </main>

        <footer className="relative z-10 py-12 border-t border-slate-50 flex flex-col items-center gap-4">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em]">Gerador de Currículos CurriculoBR</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {isCropModalOpen && tempImage && (
        <PhotoCropModal 
          imageSrc={tempImage} 
          onConfirm={handleCropConfirm} 
          onCancel={() => { setIsCropModalOpen(false); setTempImage(null); }} 
        />
      )}

      <nav className="no-print h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 z-50 shrink-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
             <i className="fas fa-file-invoice text-sm"></i>
          </div>
          <h1 className="font-extrabold text-xl tracking-tighter text-slate-800 uppercase italic">Curriculo<span className="text-blue-600">BR</span></h1>
        </div>
        <div className="hidden lg:flex items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="w-32 h-1.5 bg-slate-100 rounded-full">
                 <div className={`h-full rounded-full transition-all duration-1000 ${cvScore > 70 ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${cvScore}%` }}></div>
              </div>
              <span className="text-xs font-black text-slate-700 tracking-tighter">{cvScore}% Completo</span>
           </div>
           <div className="flex gap-4">
             <button onClick={() => setView('home')} className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Voltar</button>
             <button onClick={() => window.print()} className="bg-blue-600 text-white px-8 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-50">
               <i className="fas fa-download"></i> Baixar PDF
             </button>
           </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        <div className="no-print w-[420px] flex flex-col border-r border-slate-100 bg-white z-40 shrink-0 shadow-xl">
           <div className="flex overflow-x-auto border-b border-slate-50 shrink-0 custom-scrollbar bg-slate-50/50">
             {STEPS.map((step, idx) => (
               <button key={step.id} onClick={() => setCurrentStep(idx)} className={`flex-1 min-w-[70px] py-4 flex flex-col items-center gap-2 transition-all relative ${currentStep === idx ? 'text-blue-600 bg-white' : 'text-slate-400 grayscale hover:bg-white/50'}`}>
                 <i className={`fas ${step.icon} text-xs`}></i>
                 <span className="text-[8px] font-bold uppercase tracking-widest">{step.label}</span>
                 {currentStep === idx && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
               </button>
             ))}
           </div>

           <div ref={editorScrollRef} className={`flex-1 overflow-y-auto custom-scrollbar p-6 transition-colors duration-500 ${highlightedStep ? 'bg-blue-50/30' : ''}`}>
              <div className={highlightedStep === activeTab ? 'section-highlight p-2' : ''}>
                {activeTab === 'info' && (
                  <div className="animate-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">Informações Pessoais</h2>
                    
                    <div className="mb-8 flex flex-col items-center">
                      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100 flex items-center justify-center">
                          {data.personalInfo.photoUrl ? (
                            <img src={data.personalInfo.photoUrl} className="w-full h-full object-cover" alt="Perfil" />
                          ) : (
                            <i className="fas fa-user text-3xl text-slate-300"></i>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-blue-600/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase text-center p-2">
                            Alterar Foto
                        </div>
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div className="space-y-4">
                      <Input label="Nome Completo" value={data.personalInfo.fullName} onChange={(v) => updatePersonalInfo('fullName', v)} placeholder="Ex: João da Silva" />
                      <Input label="Cargo Pretendido" value={data.personalInfo.jobTitle} onChange={(v) => updatePersonalInfo('jobTitle', v)} placeholder="Ex: Gerente de Vendas" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="E-mail" value={data.personalInfo.email} onChange={(v) => updatePersonalInfo('email', v)} placeholder="email@exemplo.com" />
                        <Input label="Telefone" value={data.personalInfo.phone} onChange={(v) => updatePersonalInfo('phone', v)} placeholder="(11) 99999-9999" />
                      </div>
                      <Input label="Localização" value={data.personalInfo.location} onChange={(v) => updatePersonalInfo('location', v)} placeholder="Cidade, Estado" />
                      <Input label="LinkedIn (URL)" value={data.personalInfo.linkedin} onChange={(v) => updatePersonalInfo('linkedin', v)} placeholder="linkedin.com/in/perfil" />
                      <Input label="Website / Portfólio" value={data.personalInfo.website} onChange={(v) => updatePersonalInfo('website', v)} placeholder="meusite.com" />
                    </div>
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Experiências</h2>
                      <button onClick={() => addItem('experiences')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase shadow-sm hover:bg-blue-700 transition-colors">+ Adicionar</button>
                    </div>
                    {data.experiences?.map(exp => (
                      <div key={exp.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 mb-6 relative group border-l-4 border-l-blue-400">
                        <button onClick={() => removeItem('experiences', exp.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><i className="fas fa-trash-alt text-xs"></i></button>
                        <Input label="Empresa" value={exp.company} onChange={(v) => updateItem('experiences', exp.id, 'company', v)} placeholder="Nome da empresa" />
                        <Input label="Cargo" value={exp.position} onChange={(v) => updateItem('experiences', exp.id, 'position', v)} placeholder="Seu cargo" />
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="Início" value={exp.startDate} onChange={(v) => updateItem('experiences', exp.id, 'startDate', v)} placeholder="MM/AAAA" />
                          <Input label="Fim" value={exp.endDate} onChange={(v) => updateItem('experiences', exp.id, 'endDate', v)} placeholder="MM/AAAA ou 'Atual'" />
                        </div>
                        <div className="mt-2 relative">
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Suas Atividades</label>
                            <button 
                              onClick={() => handleEnhance(exp.description, 'experiência profissional', 'experiences', exp.id)}
                              disabled={!exp.description || isEnhancing === exp.id}
                              className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 transition-all ${!exp.description ? 'text-slate-200' : 'text-blue-500 hover:text-blue-700'}`}
                            >
                              <i className={`fas ${isEnhancing === exp.id ? 'fa-circle-notch fa-spin' : 'fa-magic'}`}></i> 
                              {isEnhancing === exp.id ? 'Melhorando...' : 'Melhorar com IA'}
                            </button>
                          </div>
                          <textarea 
                            className="w-full p-4 rounded-xl border text-sm h-32 outline-none focus:ring-1 focus:ring-blue-500 bg-white shadow-inner" 
                            value={exp.description} 
                            onChange={(e) => updateItem('experiences', exp.id, 'description', e.target.value)} 
                            placeholder="Descreva suas principais conquistas..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'education' && (
                  <div className="animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Formação</h2>
                      <button onClick={() => addItem('education')} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-bold text-[10px] uppercase">+ Adicionar</button>
                    </div>
                    {data.education?.map(edu => (
                      <div key={edu.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 mb-6 relative group border-l-4 border-l-indigo-400">
                        <button onClick={() => removeItem('education', edu.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><i className="fas fa-trash-alt text-xs"></i></button>
                        <Input label="Instituição" value={edu.institution} onChange={(v) => updateItem('education', edu.id, 'institution', v)} placeholder="Nome da instituição" />
                        <Input label="Grau / Curso" value={edu.degree} onChange={(v) => updateItem('education', edu.id, 'degree', v)} placeholder="Ex: Bacharelado em Administração" />
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="Início" value={edu.startDate} onChange={(v) => updateItem('education', edu.id, 'startDate', v)} placeholder="Ano" />
                          <Input label="Fim" value={edu.endDate} onChange={(v) => updateItem('education', edu.id, 'endDate', v)} placeholder="Ano de conclusão" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Habilidades</h2>
                      <button 
                          onClick={async () => {
                              if (!data.personalInfo.jobTitle || isEnhancing) return;
                              setIsEnhancing('skills-gen');
                              try {
                                  const suggested = await suggestSkills(data.personalInfo.jobTitle);
                                  const newSkills = suggested.map(name => ({ id: Math.random().toString(36).substr(2, 9), name, level: 'Intermediate' as any }));
                                  setData(prev => ({ ...prev, skills: [...prev.skills, ...newSkills].slice(0, 15) }));
                              } catch (e) {} finally { setIsEnhancing(null); }
                          }}
                          className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1"
                      >
                          <i className={`fas ${isEnhancing === 'skills-gen' ? 'fa-circle-notch fa-spin' : 'fa-lightbulb'}`}></i> Sugerir IA
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.skills?.map(s => (
                        <div key={s.id} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 group hover:border-blue-300 transition-all shadow-sm">
                          <input className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 w-24" value={s.name} onChange={(e) => updateItem('skills', s.id, 'name', e.target.value)} placeholder="Habilidade" />
                          <button onClick={() => removeItem('skills', s.id)} className="text-slate-300 hover:text-red-400"><i className="fas fa-times text-[10px]"></i></button>
                        </div>
                      ))}
                      <button onClick={() => addItem('skills')} className="px-4 py-1.5 border border-dashed border-slate-300 rounded-full text-xs font-bold text-slate-400 hover:text-blue-500 transition-all">+ Nova</button>
                    </div>
                  </div>
                )}

                {activeTab === 'extras' && (
                  <div className="animate-in slide-in-from-bottom-2 duration-300 space-y-8">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Idiomas</h2>
                        <button onClick={() => addItem('languages')} className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">+ Novo</button>
                      </div>
                      {data.languages?.map(l => (
                        <div key={l.id} className="grid grid-cols-12 gap-2 mb-3 bg-slate-50 p-3 rounded-xl border border-slate-100 items-center">
                          <div className="col-span-5"><input className="w-full p-2 border border-slate-200 rounded-lg text-xs" placeholder="Ex: Inglês" value={l.name} onChange={(e) => updateItem('languages', l.id, 'name', e.target.value)} /></div>
                          <div className="col-span-5"><input className="w-full p-2 border border-slate-200 rounded-lg text-xs" placeholder="Ex: Avançado" value={l.level} onChange={(e) => updateItem('languages', l.id, 'level', e.target.value)} /></div>
                          <div className="col-span-2 flex items-center justify-end"><button onClick={() => removeItem('languages', l.id)} className="text-red-300 hover:text-red-500"><i className="fas fa-trash-alt text-[10px]"></i></button></div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Cursos e Certificações</h2>
                        <button onClick={() => addItem('courses')} className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest">+ Novo</button>
                      </div>
                      {data.courses?.map(c => (
                        <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4 relative">
                          <button onClick={() => removeItem('courses', c.id)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500"><i className="fas fa-trash-alt text-[10px]"></i></button>
                          <Input label="Nome do Curso" value={c.name} onChange={(v) => updateItem('courses', c.id, 'name', v)} placeholder="Ex: Metodologias Ágeis" />
                          <div className="grid grid-cols-2 gap-4">
                             <Input label="Instituição" value={c.institution} onChange={(v) => updateItem('courses', c.id, 'institution', v)} placeholder="Ex: Udemy" />
                             <Input label="Ano" value={c.year} onChange={(v) => updateItem('courses', c.id, 'year', v)} placeholder="AAAA" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'summary' && (
                  <div className="animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Resumo Profissional</h2>
                      <div className="flex gap-4">
                          <button 
                              onClick={handleGenerateSummary}
                              disabled={!data.personalInfo.jobTitle || isEnhancing === 'summary-gen'}
                              className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1"
                          >
                              <i className={`fas ${isEnhancing === 'summary-gen' ? 'fa-circle-notch fa-spin' : 'fa-wand-magic-sparkles'}`}></i> Redigir IA
                          </button>
                      </div>
                    </div>
                    <textarea 
                      className="w-full p-6 rounded-2xl border text-sm h-64 outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed bg-slate-50 shadow-inner custom-scrollbar" 
                      value={data.summary} 
                      onChange={(e) => setData(prev => ({ ...prev, summary: e.target.value }))} 
                      placeholder="Escreva uma breve apresentação..." 
                    />
                  </div>
                )}
              </div>
              
              <AdBanner />
           </div>

           <div className="p-6 border-t border-slate-50 flex items-center justify-between gap-4 shrink-0 no-print">
              <button 
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} 
                className={`flex-1 py-3 font-bold text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all ${currentStep === 0 ? 'invisible' : ''}`}
              >
                Anterior
              </button>
              <button 
                onClick={() => currentStep === STEPS.length - 1 ? window.print() : setCurrentStep(prev => prev + 1)} 
                className="flex-[2] py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-md"
              >
                {currentStep === STEPS.length - 1 ? 'Baixar Currículo' : 'Próximo Passo'}
              </button>
           </div>
        </div>

        <div ref={previewContainerRef} className="flex-1 bg-[#f1f5f9] relative flex items-center justify-center overflow-hidden paper-texture no-print-container-parent transition-all duration-300">
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
             className="absolute bottom-6 right-6 no-print w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-600 hover:text-blue-600 z-[60] border border-slate-100 transition-transform active:scale-90"
             title={isSidebarOpen ? "Expandir Prévia" : "Ver Estilos"}
           >
             <i className={`fas ${isSidebarOpen ? 'fa-expand' : 'fa-palette'}`}></i>
           </button>

           <div className="print-container transition-transform duration-300 ease-out flex items-center justify-center" style={{ transform: `scale(${previewScale})` }}>
              <div className="bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-slate-200">
                <ResumePreview data={data} template={template} onSectionClick={handleSectionClick} />
              </div>
           </div>
        </div>

        <div className={`no-print border-l border-slate-100 bg-white flex flex-col shrink-0 z-40 no-print-sidebar transition-all duration-300 ease-in-out shadow-2xl overflow-hidden ${isSidebarOpen ? 'w-[320px] opacity-100' : 'w-0 opacity-0'}`}>
           <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <i className="fas fa-palette text-blue-600"></i> Estilos
              </h2>
              <button onClick={() => setIsSidebarOpen(false)} className="text-slate-300 hover:text-slate-600 transition-colors">
                <i className="fas fa-chevron-right text-xs"></i>
              </button>
           </div>

           <div className="p-6 border-b border-slate-50 space-y-4">
              <button onClick={() => setData(MOCK_RESUME_DATA)} className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100/50">
                Preencher com Exemplo
              </button>
           </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Selecione um Template</h3>
              <div className="space-y-3">
                 {TEMPLATES.map(t => (
                   <button key={t.id} onClick={() => setTemplate(t.id as TemplateId)} className={`w-full p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 group ${template === t.id ? 'border-blue-600 bg-blue-50/50 shadow-inner' : 'border-slate-50 hover:border-slate-200'}`}>
                      <div className="flex items-center gap-4 w-full">
                        <div className={`w-10 h-10 ${t.color} rounded-xl shadow-lg shrink-0 group-hover:rotate-6 transition-all`}></div>
                        <div className="text-left flex-1">
                          <p className={`text-[10px] font-black uppercase tracking-tight ${template === t.id ? 'text-blue-700' : 'text-slate-700'}`}>{t.label}</p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">{t.desc}</p>
                        </div>
                        {template === t.id && <i className="fas fa-check-circle text-blue-600 text-xs"></i>}
                      </div>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;

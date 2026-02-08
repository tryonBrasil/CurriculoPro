
import React from 'react';
import { ResumeData, TemplateId } from '../types';

interface Props {
  data: ResumeData;
  template: TemplateId;
  onSectionClick?: (sectionId: string) => void;
}

const ResumePreview: React.FC<Props> = ({ data, template, onSectionClick }) => {
  const { personalInfo, summary, experiences, education, skills, languages } = data;

  const sectionStyle = "relative cursor-pointer hover:ring-2 hover:ring-blue-400/30 hover:bg-blue-50/5 hover:shadow-md hover:scale-[1.01] hover:z-10 rounded-sm transition-all duration-300 group/section p-1";

  const renderProgressBar = (percentage: number, color: string) => (
    <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-500`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );

  const a4ContainerStyle = "bg-white w-[210mm] h-[297mm] mx-auto shadow-2xl relative overflow-hidden flex flex-col print-container font-['Inter']";

  const ContactInfo = ({ icon, text }: { icon: string, text: string }) => (
    <div className="flex items-center gap-2 text-[10px] opacity-90">
      <i className={`fas ${icon} w-3.5 text-center`}></i>
      <span className="truncate">{text}</span>
    </div>
  );

  // TEMPLATE: CLASSIC SERIF (Tradicional, Acadêmico, Elegante)
  const renderClassicSerif = () => (
    <div id="resume-preview" className={`${a4ContainerStyle} font-serif p-16 bg-white text-slate-900 border-[1.5rem] border-slate-50`}>
      <header className={`text-center mb-12 border-b-2 border-slate-900 pb-8 ${sectionStyle}`} onClick={() => onSectionClick?.('info')}>
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-2 italic">{personalInfo.fullName || 'SEU NOME COMPLETO'}</h1>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500 mb-6">{personalInfo.jobTitle || 'CARGO PRETENDIDO'}</p>
        <div className="flex justify-center flex-wrap gap-8 text-[11px] font-sans">
          <span>{personalInfo.email}</span>
          <span>{personalInfo.phone}</span>
          <span>{personalInfo.location}</span>
          {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin}</span>}
        </div>
      </header>

      <div className="space-y-12">
        <section className={sectionStyle} onClick={() => onSectionClick?.('summary')}>
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] mb-4 text-center border-b border-slate-100 pb-2">Sobre Profissional</h2>
          <p className="text-[12px] leading-relaxed italic text-center max-w-2xl mx-auto">{summary}</p>
        </section>

        <section className={sectionStyle} onClick={() => onSectionClick?.('experience')}>
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] mb-6">Experiência Profissional</h2>
          <div className="space-y-8">
            {experiences.map(exp => (
              <div key={exp.id} className="grid grid-cols-12 gap-4">
                <div className="col-span-3 text-[10px] font-bold text-slate-400 pt-1">{exp.startDate} — {exp.endDate}</div>
                <div className="col-span-9">
                  <h3 className="font-bold text-sm uppercase">{exp.position}</h3>
                  <p className="text-[11px] font-bold italic text-slate-600 mb-2">{exp.company}</p>
                  <p className="text-[11px] text-slate-700 font-sans leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={sectionStyle} onClick={() => onSectionClick?.('education')}>
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] mb-6">Educação e Formação</h2>
          <div className="grid grid-cols-2 gap-12">
            {education.map(edu => (
              <div key={edu.id}>
                <h3 className="font-bold text-[12px] uppercase">{edu.institution}</h3>
                <p className="text-[11px] italic">{edu.degree}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-sans">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  // TEMPLATE: SWISS MINIMAL (Focado em Espaço e Grid)
  const renderSwissMinimal = () => (
    <div id="resume-preview" className={`${a4ContainerStyle} p-12 bg-white text-slate-900`}>
      <header className={`mb-16 flex justify-between items-end ${sectionStyle}`} onClick={() => onSectionClick?.('info')}>
        <div>
          <h1 className="text-6xl font-black uppercase leading-[0.8] mb-4 tracking-tighter">{personalInfo.fullName?.split(' ')[0] || 'NOME'}<br/><span className="text-slate-200">{personalInfo.fullName?.split(' ').slice(1).join(' ') || 'CURRICULO'}</span></h1>
          <p className="text-lg font-bold uppercase tracking-tight text-slate-400">{personalInfo.jobTitle || 'Cargo Profissional'}</p>
        </div>
        <div className="text-right text-[10px] font-bold space-y-1 uppercase tracking-widest text-slate-400">
          <p>{personalInfo.phone}</p>
          <p>{personalInfo.email}</p>
          <p>{personalInfo.location}</p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12 flex-1">
        <div className="col-span-4 space-y-10">
          <section className={sectionStyle} onClick={() => onSectionClick?.('summary')}>
            <h2 className="text-[11px] font-black uppercase mb-4 border-t-4 border-slate-900 pt-2">Resumo</h2>
            <p className="text-[10px] leading-relaxed text-slate-500 font-medium">{summary}</p>
          </section>

          <section className={sectionStyle} onClick={() => onSectionClick?.('skills')}>
            <h2 className="text-[11px] font-black uppercase mb-4 border-t-4 border-slate-900 pt-2">Competências</h2>
            <div className="space-y-1">
              {skills.map(s => (
                <p key={s.id} className="text-[10px] font-bold text-slate-800">{s.name}</p>
              ))}
            </div>
          </section>

          <section className={sectionStyle} onClick={() => onSectionClick?.('extras')}>
            <h2 className="text-[11px] font-black uppercase mb-4 border-t-4 border-slate-900 pt-2">Idiomas</h2>
            <div className="space-y-3">
              {languages.map(l => (
                <div key={l.id}>
                  <p className="text-[10px] font-bold">{l.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{l.level}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-8 space-y-12">
          <section className={sectionStyle} onClick={() => onSectionClick?.('experience')}>
            <h2 className="text-[11px] font-black uppercase mb-6 border-t-4 border-slate-900 pt-2">Experiência</h2>
            <div className="space-y-8">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between font-black text-xs mb-1 uppercase tracking-tight">
                    <h3>{exp.position}</h3>
                    <span>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">{exp.company}</p>
                  <p className="text-[11px] text-slate-600 leading-snug">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={sectionStyle} onClick={() => onSectionClick?.('education')}>
            <h2 className="text-[11px] font-black uppercase mb-6 border-t-4 border-slate-900 pt-2">Formação</h2>
            <div className="space-y-6">
              {education.map(edu => (
                <div key={edu.id}>
                  <p className="font-black text-xs uppercase">{edu.institution}</p>
                  <p className="text-[10px] font-bold text-slate-400">{edu.degree}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  // TEMPLATE: EXECUTIVE NAVY (Premium, Luxury feel)
  const renderExecutiveNavy = () => (
    <div id="resume-preview" className={`${a4ContainerStyle} bg-white flex-row`}>
      <div className="w-[85mm] bg-[#0f172a] text-white p-12 flex flex-col shrink-0">
        <div className={`mb-12 text-center ${sectionStyle}`} onClick={() => onSectionClick?.('info')}>
          <div className="w-44 h-44 rounded-full overflow-hidden mx-auto mb-8 border-4 border-[#94a3b8]/20 p-1">
            {personalInfo.photoUrl ? (
               <img src={personalInfo.photoUrl} className="w-full h-full object-cover rounded-full" />
            ) : (
               <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center"><i className="fas fa-user text-6xl opacity-20"></i></div>
            )}
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight mb-2 leading-none">{personalInfo.fullName || 'SEU NOME'}</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{personalInfo.jobTitle || 'Executive'}</p>
        </div>

        <div className="space-y-10">
          <section className={sectionStyle} onClick={() => onSectionClick?.('info')}>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-slate-500"></span> Contato
            </h2>
            <div className="space-y-4">
              <ContactInfo icon="fa-envelope" text={personalInfo.email} />
              <ContactInfo icon="fa-phone" text={personalInfo.phone} />
              <ContactInfo icon="fa-map-marker-alt" text={personalInfo.location} />
            </div>
          </section>

          <section className={sectionStyle} onClick={() => onSectionClick?.('skills')}>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-slate-500"></span> Expertises
            </h2>
            <div className="space-y-3">
              {skills.map(s => (
                <div key={s.id}>
                  <p className="text-[10px] font-bold mb-1">{s.name}</p>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-[#facc15]" style={{ width: '80%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="flex-1 p-16 flex flex-col gap-12">
        <section className={sectionStyle} onClick={() => onSectionClick?.('summary')}>
          <h2 className="text-[11px] font-black text-[#0f172a] uppercase tracking-[0.2em] mb-4 flex items-center gap-4">
             <span className="w-10 h-0.5 bg-[#facc15]"></span> Perfil Profissional
          </h2>
          <p className="text-[11px] leading-relaxed text-slate-600 font-medium">{summary}</p>
        </section>

        <section className={sectionStyle} onClick={() => onSectionClick?.('experience')}>
          <h2 className="text-[11px] font-black text-[#0f172a] uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
             <span className="w-10 h-0.5 bg-[#facc15]"></span> Experiência Profissional
          </h2>
          <div className="space-y-10">
            {experiences.map(exp => (
              <div key={exp.id} className="relative pl-6 border-l-2 border-slate-50">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#facc15]"></div>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-black text-slate-900 text-sm">{exp.position}</h3>
                  <span className="text-[10px] font-bold text-slate-400">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase mb-3">{exp.company}</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  // TEMPLATES EXISTENTES (Mantidos para compatibilidade)
  const renderModernBlue = () => (
    <div id="resume-preview" className={`${a4ContainerStyle} flex-row`}>
      <div className="w-[75mm] bg-[#1e40af] text-white p-10 flex flex-col shrink-0">
        <div className={`mb-12 text-center ${sectionStyle}`} onClick={() => onSectionClick?.('info')}>
          <div className="w-44 h-44 rounded-[2.5rem] overflow-hidden mx-auto mb-8 border-4 border-white/20 shadow-2xl flex items-center justify-center bg-[#1e3a8a]">
            {personalInfo.photoUrl ? (
              <img src={personalInfo.photoUrl} className="w-full h-full object-cover object-center" alt="Perfil" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><i className="fas fa-user text-6xl opacity-20"></i></div>
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase tracking-tight">{personalInfo.fullName || 'Seu Nome'}</h1>
            <div className="h-1 w-12 bg-white/30 mx-auto rounded-full"></div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-80">{personalInfo.jobTitle || 'Seu Cargo'}</p>
          </div>
        </div>
        <div className="space-y-10 flex-1">
          <section className={sectionStyle} onClick={() => onSectionClick?.('info')}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Contato</h2>
            <div className="space-y-3">
              <ContactInfo icon="fa-phone" text={personalInfo.phone} />
              <ContactInfo icon="fa-envelope" text={personalInfo.email} />
              <ContactInfo icon="fa-map-marker-alt" text={personalInfo.location} />
            </div>
          </section>
          <section className={sectionStyle} onClick={() => onSectionClick?.('skills')}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Habilidades</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => <span key={s.id} className="bg-white/10 px-2.5 py-1 rounded-lg text-[9px] font-bold">{s.name}</span>)}
            </div>
          </section>
        </div>
      </div>
      <div className="flex-1 p-16 flex flex-col gap-12 bg-white">
        <section className={sectionStyle} onClick={() => onSectionClick?.('summary')}>
          <h2 className="text-[11px] font-black text-[#1e40af] uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
             <span className="w-8 h-[2px] bg-[#1e40af]"></span> Perfil
          </h2>
          <p className="text-[11px] leading-relaxed text-slate-600 font-medium ml-11">{summary}</p>
        </section>
        <section className={sectionStyle} onClick={() => onSectionClick?.('experience')}>
          <h2 className="text-[11px] font-black text-[#1e40af] uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
             <span className="w-8 h-[2px] bg-[#1e40af]"></span> Experiência
          </h2>
          <div className="ml-11 space-y-8">
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-extrabold text-slate-900 text-sm">{exp.position}</h3>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{exp.startDate} — {exp.endDate}</span>
                </div>
                <p className="text-[10px] font-bold text-blue-600 mb-3">{exp.company}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderTealSidebar = () => (
    <div id="resume-preview" className={`${a4ContainerStyle} flex-row`}>
      <div className="w-[72mm] bg-[#2D4F4F] text-white p-8 flex flex-col shrink-0">
        <div className={`mb-10 text-center ${sectionStyle}`} onClick={() => onSectionClick?.('info')}>
          <div className="w-36 h-36 rounded-2xl overflow-hidden mx-auto mb-6 border-4 border-white/10 shadow-2xl">
            {personalInfo.photoUrl ? (
              <img src={personalInfo.photoUrl} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-700 flex items-center justify-center"><i className="fas fa-user text-5xl opacity-20"></i></div>
            )}
          </div>
          <h1 className="text-xl font-bold leading-tight uppercase tracking-wider">{personalInfo.fullName}</h1>
          <p className="text-[10px] opacity-70 font-medium uppercase tracking-[0.2em] mt-2">{personalInfo.jobTitle}</p>
        </div>
        <div className="space-y-8 flex-1">
          <section className={sectionStyle} onClick={() => onSectionClick?.('info')}>
            <h2 className="text-[10px] font-black uppercase tracking-widest mb-4 border-b border-white/20 pb-1">Contato</h2>
            <div className="space-y-2.5">
              <ContactInfo icon="fa-phone" text={personalInfo.phone} />
              <ContactInfo icon="fa-envelope" text={personalInfo.email} />
              <ContactInfo icon="fa-map-marker-alt" text={personalInfo.location} />
            </div>
          </section>
        </div>
      </div>
      <div className="flex-1 p-12 pt-16 flex flex-col gap-10">
        <section className={sectionStyle} onClick={() => onSectionClick?.('summary')}>
          <h2 className="text-xs font-black text-[#2D4F4F] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[#2D4F4F]"></span> Perfil
          </h2>
          <p className="text-[11px] leading-relaxed text-slate-600 font-medium">{summary}</p>
        </section>
        <section className={sectionStyle} onClick={() => onSectionClick?.('experience')}>
          <h2 className="text-xs font-black text-[#2D4F4F] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[#2D4F4F]"></span> Experiência
          </h2>
          <div className="space-y-6">
            {experiences.map(exp => (
              <div key={exp.id} className="relative pl-4 border-l border-slate-100">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-900 text-[12px]">{exp.position}</h3>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{exp.startDate} — {exp.endDate}</span>
                </div>
                <p className="text-[10px] font-bold text-teal-700 mb-2">{exp.company}</p>
                <p className="text-[10px] text-slate-500 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderExecutiveRed = () => (
    <div id="resume-preview" className={`${a4ContainerStyle} p-0`}>
      <header className={`bg-slate-900 text-white p-12 pb-20 flex justify-between items-center relative ${sectionStyle}`} onClick={() => onSectionClick?.('info')}>
        <div className="max-w-[65%]">
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.9]">
            {personalInfo.fullName?.split(' ')[0]}<br/>
            <span className="text-red-500">{personalInfo.fullName?.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-sm font-bold tracking-[0.3em] uppercase mt-6 opacity-60">{personalInfo.jobTitle}</p>
        </div>
        <div className="w-40 h-40 rounded-full border-[10px] border-white/5 overflow-hidden flex items-center justify-center bg-slate-800">
          {personalInfo.photoUrl ? <img src={personalInfo.photoUrl} className="w-full h-full object-cover" /> : <i className="fas fa-user text-5xl opacity-10"></i>}
        </div>
      </header>
      <div className="px-12 -mt-10 relative z-10 flex gap-10 flex-1 pb-12">
        <div className="w-[120mm] bg-white shadow-xl rounded-2xl p-8 space-y-10">
          <section className={sectionStyle} onClick={() => onSectionClick?.('experience')}>
            <h2 className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-6 flex items-center gap-2">
              <i className="fas fa-briefcase"></i> Experiência
            </h2>
            <div className="space-y-8">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900 text-[13px]">{exp.position}</h3>
                    <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-[10px] font-bold text-red-600 mb-2">{exp.company}</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const renderCorporateGray = () => (
    <div id="resume-preview" className={`${a4ContainerStyle} flex-row`}>
      <div className="w-[80mm] bg-[#F1F5F9] p-10 flex flex-col shrink-0">
        <div className={`text-center ${sectionStyle}`} onClick={() => onSectionClick?.('info')}>
          <div className="w-44 h-44 rounded-full overflow-hidden border-8 border-white shadow-xl mx-auto mb-6">
            {personalInfo.photoUrl ? <img src={personalInfo.photoUrl} className="w-full h-full object-cover grayscale" /> : <div className="w-full h-full bg-slate-200 flex items-center justify-center"><i className="fas fa-user text-5xl text-slate-400"></i></div>}
          </div>
          <div className="space-y-4 text-slate-700">
            <ContactInfo icon="fa-phone" text={personalInfo.phone} />
            <ContactInfo icon="fa-envelope" text={personalInfo.email} />
          </div>
        </div>
      </div>
      <div className="flex-1 p-16 flex flex-col gap-12">
        <header className={sectionStyle} onClick={() => onSectionClick?.('info')}>
          <h1 className="text-4xl font-bold text-slate-900 uppercase leading-none mb-4">{personalInfo.fullName}</h1>
          <p className="text-lg text-slate-400 font-medium">{personalInfo.jobTitle}</p>
          <div className="w-16 h-1 bg-slate-900 mt-8"></div>
        </header>
        <section className={sectionStyle} onClick={() => onSectionClick?.('experience')}>
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6">Experiência</h2>
          <div className="space-y-8">
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-800 text-[13px]">{exp.position}</h3>
                  <span className="text-[10px] font-medium text-slate-400">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-[11px] font-bold text-slate-500 italic mb-2">{exp.company}</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderMinimalRed = () => (
    <div id="resume-preview" className={`${a4ContainerStyle} p-16`}>
      <header className={`flex items-start justify-between mb-16 ${sectionStyle}`} onClick={() => onSectionClick?.('info')}>
        <div className="max-w-[70%]">
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">{personalInfo.fullName}</h1>
          <p className="text-xl text-red-600 font-medium mb-8">{personalInfo.jobTitle}</p>
          <div className="flex flex-wrap gap-x-6">
            <ContactInfo icon="fa-envelope" text={personalInfo.email} />
            <ContactInfo icon="fa-phone" text={personalInfo.phone} />
          </div>
        </div>
      </header>
      <div className="grid grid-cols-12 gap-16 flex-1">
        <div className="col-span-8 space-y-12">
          <section className={sectionStyle} onClick={() => onSectionClick?.('experience')}>
             <h2 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-8 border-b-2 border-slate-50">Experiência</h2>
             <div className="space-y-10">
               {experiences.map(exp => (
                 <div key={exp.id}>
                   <div className="flex justify-between items-baseline mb-2">
                     <h3 className="font-extrabold text-slate-900 text-sm">{exp.position}</h3>
                     <span className="text-[10px] font-bold text-slate-400">{exp.startDate} - {exp.endDate}</span>
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 mb-3 tracking-widest">{exp.company}</p>
                   <p className="text-[11px] text-slate-600 leading-relaxed">{exp.description}</p>
                 </div>
               ))}
             </div>
          </section>
        </div>
      </div>
    </div>
  );

  switch(template) {
    case 'modern_blue': return renderModernBlue();
    case 'teal_sidebar': return renderTealSidebar();
    case 'executive_red': return renderExecutiveRed();
    case 'corporate_gray': return renderCorporateGray();
    case 'minimal_red_line': return renderMinimalRed();
    case 'classic_serif': return renderClassicSerif();
    case 'swiss_minimal': return renderSwissMinimal();
    case 'executive_navy': return renderExecutiveNavy();
    default: return renderModernBlue();
  }
};

export default ResumePreview;

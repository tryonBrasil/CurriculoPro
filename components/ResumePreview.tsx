import React from 'react';
import { ResumeData, TemplateId } from '../types';

interface Props {
  data: ResumeData;
  template: TemplateId;
  onSectionClick?: (sectionId: string) => void;
}

const ResumePreview: React.FC<Props> = ({ data, template, onSectionClick }) => {
  const { personalInfo, summary, experiences, education, skills, languages, courses } = data;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert('Link do currículo copiado!');
  };

  const sectionStyle = "relative cursor-pointer hover:ring-2 hover:ring-blue-400/30 hover:bg-blue-50/10 rounded-sm transition-all duration-200 group/section";

  const renderProgressBar = (percentage: number, color: string) => (
    <div className="flex gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i} 
          className={`h-1.5 w-6 rounded-sm ${i * 20 <= percentage ? color : 'bg-slate-200'}`} 
        />
      ))}
    </div>
  );

  const a4ContainerStyle = "bg-white w-[210mm] h-[297mm] mx-auto shadow-2xl relative overflow-hidden flex flex-col print-container";

  // MODELO 1: TEAL SIDEBAR
  const renderTealSidebar = () => (
    <div id="resume-preview" className={`${a4ContainerStyle} flex-row`}>
      <button 
        onClick={handleShare}
        className="no-print absolute top-8 right-8 w-10 h-10 bg-[#8BA9A4] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#6d8a85] transition-all z-30 group"
        title="Compartilhar Currículo"
      >
        <i className="fas fa-share-alt group-hover:scale-110 transition-transform"></i>
      </button>

      <div className="w-[70mm] bg-[#8BA9A4] text-white p-8 flex flex-col pt-32 space-y-8 shrink-0">
        <section className={sectionStyle} onClick={() => onSectionClick?.('info')}>
          <h2 className="text-sm font-bold uppercase mb-4 border-b border-white/30 pb-1">Contato</h2>
          <div className="space-y-3 text-[11px]">
            <p className="break-all">{personalInfo.linkedin}</p>
            <p>{personalInfo.phone}</p>
            <p>{personalInfo.email}</p>
            <p>{personalInfo.location}</p>
          </div>
        </section>

        <section className={sectionStyle} onClick={() => onSectionClick?.('skills')}>
          <h2 className="text-sm font-bold uppercase mb-4 border-b border-white/30 pb-1">Habilidades</h2>
          <ul className="space-y-2 text-[11px] list-disc ml-4">
            {skills.map(s => <li key={s.id}>{s.name}</li>)}
          </ul>
        </section>

        <section className={sectionStyle} onClick={() => onSectionClick?.('extras')}>
          <h2 className="text-sm font-bold uppercase mb-4 border-b border-white/30 pb-1">Idiomas</h2>
          <div className="space-y-4 text-[11px]">
            {languages.map(l => (
              <div key={l.id}>
                <p className="font-bold">{l.name}: {l.level}</p>
                {renderProgressBar(l.percentage, 'bg-[#4A635E]')}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="flex-1 p-10 pt-16 relative overflow-hidden flex flex-col">
        <div className={`flex justify-between items-center mb-12 ${sectionStyle}`} onClick={() => onSectionClick?.('info')}>
          <div className="max-w-[70%]">
            <h1 className="text-4xl font-light tracking-tight leading-tight text-slate-900 uppercase">
              {personalInfo.fullName.split(' ')[0] || 'NOME'}<br/>
              <span className="font-bold">{personalInfo.fullName.split(' ').slice(1).join(' ') || 'SOBRENOME'}</span>
            </h1>
            <div className="h-1 w-20 bg-[#8BA9A4] mt-6"></div>
          </div>
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#8BA9A4]/20 shrink-0 flex items-center justify-center">
            {personalInfo.photoUrl ? (
                <img src={personalInfo.photoUrl} className="w-full h-full object-cover" alt="Foto" />
            ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <i className="fas fa-user text-4xl"></i>
                </div>
            )}
          </div>
        </div>

        <div className="space-y-8 flex-1 overflow-hidden">
          <section className={sectionStyle} onClick={() => onSectionClick?.('summary')}>
            <h2 className="text-sm font-bold uppercase text-[#8BA9A4] mb-2">Resumo</h2>
            <p className="text-[11px] leading-relaxed text-slate-600 italic">{summary || 'Seu resumo...'}</p>
          </section>

          <section className={sectionStyle} onClick={() => onSectionClick?.('experience')}>
            <h2 className="text-sm font-bold uppercase text-[#8BA9A4] mb-3 border-b border-slate-100 pb-1">Experiência Profissional</h2>
            <div className="space-y-4">
              {experiences.slice(0, 3).map(exp => (
                <div key={exp.id}>
                  <h3 className="font-bold text-slate-800 text-sm">{exp.position}</h3>
                  <p className="text-[10px] text-slate-400 mb-1">{exp.company} | {exp.startDate} - {exp.endDate}</p>
                  <p className="text-[10px] text-slate-600 leading-snug whitespace-pre-wrap">{exp.description.substring(0, 300)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={sectionStyle} onClick={() => onSectionClick?.('education')}>
            <h2 className="text-sm font-bold uppercase text-[#8BA9A4] mb-3 border-b border-slate-100 pb-1">Formação Acadêmica</h2>
            <div className="space-y-3">
              {education.slice(0, 2).map(edu => (
                <div key={edu.id}>
                  <p className="font-bold text-slate-800 text-sm leading-tight">{edu.institution}</p>
                  <p className="text-[10px] text-slate-500 italic">{edu.degree} em {edu.field}</p>
                  <p className="text-[10px] text-slate-400">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  // MODELO 2: EXECUTIVE RED
  const renderExecutiveRed = () => (
    <div id="resume-preview" className={`${a4ContainerStyle} p-12`}>
      <div className="absolute top-[-40px] right-[-40px] w-56 h-56 rounded-full bg-[#800000]"></div>
      
      <header className={`flex justify-between items-center mb-12 relative z-10 ${sectionStyle}`} onClick={() => onSectionClick?.('info')}>
        <div>
          <h1 className="text-5xl font-black text-[#800000] tracking-tighter leading-[0.85] uppercase">
            {personalInfo.fullName.split(' ')[0] || 'NOME'}<br/>
            {personalInfo.fullName.split(' ').slice(1).join(' ') || 'SOBRENOME'}
          </h1>
          <div className="mt-6 flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>{personalInfo.email}</span> | <span>{personalInfo.phone}</span>
          </div>
        </div>
        <div className="w-36 h-36 rounded-full border-8 border-white shadow-lg overflow-hidden shrink-0 flex items-center justify-center bg-slate-50">
            {personalInfo.photoUrl ? (
                <img src={personalInfo.photoUrl} className="w-full h-full object-cover" />
            ) : (
                <i className="fas fa-user text-5xl text-slate-200"></i>
            )}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10 relative z-10 flex-1 overflow-hidden">
        <div className="col-span-7 space-y-8 overflow-hidden">
          <section className={sectionStyle} onClick={() => onSectionClick?.('summary')}>
            <h2 className="text-[11px] font-black text-[#800000] uppercase tracking-widest mb-3 border-b-2 border-[#800000]/10 pb-1">Resumo Profissional</h2>
            <p className="text-[11px] leading-relaxed italic text-slate-700">{summary}</p>
          </section>

          <section className={sectionStyle} onClick={() => onSectionClick?.('experience')}>
            <h2 className="text-[11px] font-black text-[#800000] uppercase tracking-widest mb-4 border-b-2 border-[#800000]/10 pb-1">Experiência</h2>
            <div className="space-y-5">
              {experiences.slice(0, 3).map(exp => (
                <div key={exp.id} className="border-l-2 border-[#800000] pl-4">
                  <h3 className="font-bold text-slate-900 text-[12px] uppercase">{exp.position}</h3>
                  <p className="text-[9px] font-bold text-slate-400 mb-1 uppercase">{exp.company} | {exp.startDate} - {exp.endDate}</p>
                  <p className="text-[10px] text-slate-600 leading-snug">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-5 space-y-8 border-l border-slate-100 pl-8 overflow-hidden">
          <section className={sectionStyle} onClick={() => onSectionClick?.('skills')}>
            <h2 className="text-[11px] font-black text-[#800000] uppercase tracking-widest mb-3">Habilidades</h2>
            <ul className="space-y-1.5">
              {skills.slice(0, 8).map(s => (
                <li key={s.id} className="flex items-center gap-2 text-[10px] font-bold text-slate-600 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#800000] shrink-0"></span>
                  {s.name}
                </li>
              ))}
            </ul>
          </section>

          <section className={sectionStyle} onClick={() => onSectionClick?.('education')}>
            <h2 className="text-[11px] font-black text-[#800000] uppercase tracking-widest mb-3">Educação</h2>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <p className="font-bold text-[11px] leading-tight text-slate-800">{edu.institution}</p>
                  <p className="text-[9px] text-[#800000] italic font-bold">{edu.degree}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={sectionStyle} onClick={() => onSectionClick?.('extras')}>
            <h2 className="text-[11px] font-black text-[#800000] uppercase tracking-widest mb-3">Idiomas</h2>
            <div className="space-y-3">
              {languages.map(l => (
                <div key={l.id} className="text-[10px]">
                  <p className="font-bold uppercase text-slate-500 mb-1">{l.name}</p>
                  {renderProgressBar(l.percentage, 'bg-[#800000]')}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  // MODELO 3: CORPORATE GRAY
  const renderCorporateGray = () => (
    <div id="resume-preview" className={`${a4ContainerStyle} flex-row`}>
      <div className="w-[75mm] bg-[#666666] text-white p-10 flex flex-col pt-10 space-y-10 shrink-0">
        <div className={`${sectionStyle} mb-4 overflow-hidden rounded-lg`} onClick={() => onSectionClick?.('info')}>
            {personalInfo.photoUrl ? (
                <img src={personalInfo.photoUrl} className="w-full aspect-square object-cover border-4 border-white grayscale" />
            ) : (
                <div className="w-full aspect-square border-4 border-white grayscale bg-slate-500 flex items-center justify-center">
                    <i className="fas fa-user text-6xl text-slate-400"></i>
                </div>
            )}
        </div>

        <section className={sectionStyle} onClick={() => onSectionClick?.('info')}>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b border-white/20 pb-1">Contato</h2>
          <div className="space-y-3 text-[10px]">
            <div className="flex items-center gap-2"><i className="fas fa-phone w-3"></i> {personalInfo.phone}</div>
            <div className="flex items-center gap-2"><i className="fas fa-envelope w-3"></i> {personalInfo.email}</div>
            <div className="flex items-center gap-2"><i className="fas fa-map-marker-alt w-3"></i> {personalInfo.location}</div>
          </div>
        </section>

        <section className={sectionStyle} onClick={() => onSectionClick?.('skills')}>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b border-white/20 pb-1">Habilidades</h2>
          <ul className="space-y-1.5 text-[10px]">
            {skills.slice(0, 10).map(s => <li key={s.id} className="flex gap-2 items-start"><span className="mt-1 w-1 h-1 bg-white rounded-full shrink-0"></span>{s.name}</li>)}
          </ul>
        </section>
      </div>

      <div className="flex-1 p-12 overflow-hidden flex flex-col">
        <header className={`mb-12 ${sectionStyle}`} onClick={() => onSectionClick?.('info')}>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase border-b-[6px] border-slate-900 pb-1 inline-block leading-none">{personalInfo.fullName || 'SEU NOME'}</h1>
          <p className="text-base text-slate-400 font-bold uppercase tracking-widest mt-4 italic">{personalInfo.jobTitle || 'SEU CARGO'}</p>
        </header>

        <div className="space-y-8 flex-1 overflow-hidden">
          <section className={sectionStyle} onClick={() => onSectionClick?.('summary')}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-3 border-b-2 border-slate-900 pb-1">Perfil</h2>
            <p className="text-[11px] leading-relaxed text-slate-600">{summary}</p>
          </section>

          <section className={sectionStyle} onClick={() => onSectionClick?.('experience')}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 border-b-2 border-slate-900 pb-1">Histórico Profissional</h2>
            <div className="space-y-6">
              {experiences.slice(0, 3).map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-black text-slate-900 text-[12px] uppercase">{exp.position}</h3>
                    <span className="text-[9px] font-black text-slate-400">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-500 mb-1 uppercase italic leading-tight">{exp.company}</p>
                  <p className="text-[10px] text-slate-600 leading-snug">{exp.description.substring(0, 250)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={sectionStyle} onClick={() => onSectionClick?.('education')}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 border-b-2 border-slate-900 pb-1">Formação</h2>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id} className="mb-1">
                  <p className="font-black text-slate-900 text-[11px] uppercase leading-tight">{edu.institution}</p>
                  <p className="text-[10px] text-slate-500 italic font-bold leading-tight">{edu.degree}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  // MODELO 4: MINIMAL RED LINE
  const renderMinimalRed = () => (
    <div id="resume-preview" className={`${a4ContainerStyle} p-16 border-t-[12px] border-[#D32F2F]`}>
      <header className={`text-center mb-10 ${sectionStyle}`} onClick={() => onSectionClick?.('info')}>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-3">{personalInfo.fullName || 'SEU NOME'}</h1>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-[9px] font-black uppercase text-slate-400 tracking-widest">
          <span>{personalInfo.email}</span> | <span>{personalInfo.phone}</span> | <span>{personalInfo.location}</span>
        </div>
        <div className="h-0.5 w-full bg-slate-100 mt-8"></div>
      </header>

      <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
        <div className="col-span-8 space-y-8 overflow-hidden">
          <section className={sectionStyle} onClick={() => onSectionClick?.('summary')}>
             <h2 className="text-[11px] font-black text-[#D32F2F] uppercase mb-3 tracking-widest">Sobre Mim</h2>
             <p className="text-[11px] leading-relaxed text-justify italic text-slate-700">{summary}</p>
          </section>

          <section className={sectionStyle} onClick={() => onSectionClick?.('experience')}>
             <h2 className="text-[11px] font-black text-[#D32F2F] uppercase mb-4 tracking-widest">Experiência</h2>
             <div className="space-y-6">
               {experiences.slice(0, 3).map(exp => (
                 <div key={exp.id}>
                   <h3 className="font-black text-slate-900 text-[13px] mb-0.5 uppercase tracking-tight">{exp.position}</h3>
                   <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-2 uppercase italic">
                     <span>{exp.company}</span>
                     <span>{exp.startDate} - {exp.endDate}</span>
                   </div>
                   <p className="text-[10px] text-slate-600 leading-snug pl-3 border-l-2 border-slate-50">{exp.description}</p>
                 </div>
               ))}
             </div>
          </section>
        </div>

        <div className="col-span-4 space-y-8 border-l border-slate-50 pl-6 overflow-hidden">
          <section className={sectionStyle} onClick={() => onSectionClick?.('skills')}>
            <h2 className="text-[11px] font-black text-[#D32F2F] uppercase mb-3 tracking-widest">Skills</h2>
            <ul className="space-y-1.5">
              {skills.slice(0, 10).map(s => <li key={s.id} className="text-[10px] font-black text-slate-600 italic flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#D32F2F] rounded-full shrink-0"></span>{s.name}</li>)}
            </ul>
          </section>

          <section className={sectionStyle} onClick={() => onSectionClick?.('education')}>
            <h2 className="text-[11px] font-black text-[#D32F2F] uppercase mb-3 tracking-widest">Educação</h2>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id} className="text-[10px] italic">
                  <p className="font-black text-slate-900 leading-tight">{edu.institution}</p>
                  <p className="text-slate-400 font-black text-[8px] uppercase">{edu.degree}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={sectionStyle} onClick={() => onSectionClick?.('extras')}>
            <h2 className="text-[11px] font-black text-[#D32F2F] uppercase mb-3 tracking-widest">Línguas</h2>
            <div className="space-y-3">
              {languages.map(l => (
                <div key={l.id} className="text-[9px]">
                  <p className="font-black uppercase mb-1">{l.name}</p>
                  {renderProgressBar(l.percentage, 'bg-[#D32F2F]')}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  switch(template) {
    case 'teal_sidebar': return renderTealSidebar();
    case 'executive_red': return renderExecutiveRed();
    case 'corporate_gray': return renderCorporateGray();
    case 'minimal_red_line': return renderMinimalRed();
    default: return renderTealSidebar();
  }
};

export default ResumePreview;
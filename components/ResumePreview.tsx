
import React from 'react';
import { ResumeData, TemplateId } from '../types';

interface Props {
  data: ResumeData;
  template: TemplateId;
  onSectionClick?: (sectionId: string) => void;
}

const ResumePreview: React.FC<Props> = ({ data, template, onSectionClick }) => {
  const { personalInfo, summary, experiences, education, skills, languages, courses } = data;

  const sectionStyle = "relative cursor-pointer hover:ring-2 hover:ring-blue-400/30 hover:bg-blue-50/5 hover:shadow-md hover:scale-[1.01] hover:z-10 rounded-sm transition-all duration-300 group/section p-1";

  const a4ContainerStyle = "bg-white w-[210mm] h-[297mm] mx-auto shadow-2xl relative overflow-hidden flex flex-col print-container font-['Inter']";

  const ContactInfo = ({ icon, text, dark = false }: { icon: string, text: string, dark?: boolean }) => (
    <div className={`flex items-center gap-2 text-[10px] font-medium ${dark ? 'text-slate-700' : 'text-white/80'}`}>
      <i className={`fas ${icon} w-3.5 text-center ${dark ? 'text-slate-400' : 'text-[#d4af37]'}`}></i>
      <span className="truncate">{text || ''}</span>
    </div>
  );

  // TEMPLATE: EXECUTIVE NAVY (Premium Gold & Deep Navy) - Design Aprimorado com todos os campos
  const renderExecutiveNavy = () => (
    <div id="resume-preview" className={`${a4ContainerStyle} bg-[#fdfdfd] flex-row`}>
      {/* Sidebar Marinho */}
      <div className="w-[85mm] bg-[#0c1221] text-white p-12 flex flex-col shrink-0 border-r border-[#d4af37]/10">
        <div className={`mb-12 text-center ${sectionStyle}`} onClick={() => onSectionClick?.('info')}>
          <div className="w-44 h-44 rounded-full overflow-hidden mx-auto mb-10 border-[5px] border-[#d4af37]/20 p-1 shadow-2xl shadow-black/40">
            {personalInfo.photoUrl ? (
               <img src={personalInfo.photoUrl} className="w-full h-full object-cover rounded-full" />
            ) : (
               <div className="w-full h-full bg-[#1e293b] rounded-full flex items-center justify-center"><i className="fas fa-user text-6xl opacity-10"></i></div>
            )}
          </div>
          <h1 className="text-3xl font-serif-premium uppercase tracking-tighter mb-2 leading-none text-[#d4af37] drop-shadow-sm">
            {personalInfo.fullName?.split(' ')[0] || 'Executivo'}
          </h1>
          <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-white/90">
            {personalInfo.fullName?.split(' ').slice(1).join(' ') || 'Vitae'}
          </h2>
          <div className="h-[1px] w-16 bg-[#d4af37] mx-auto mt-6 rounded-full opacity-60"></div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-6">{personalInfo.jobTitle || 'Diretor Executivo'}</p>
        </div>

        <div className="space-y-12 flex-1">
          <section className={sectionStyle} onClick={() => onSectionClick?.('info')}>
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#d4af37]/70 mb-6 flex items-center gap-3">
              <span className="w-4 h-[1px] bg-[#d4af37]/40"></span> Contato
            </h2>
            <div className="space-y-4">
              <ContactInfo icon="fa-envelope" text={personalInfo.email} />
              <ContactInfo icon="fa-phone" text={personalInfo.phone} />
              <ContactInfo icon="fa-map-marker-alt" text={personalInfo.location} />
              {personalInfo.linkedin && <ContactInfo icon="fa-linkedin-in" text={personalInfo.linkedin} />}
              {personalInfo.website && <ContactInfo icon="fa-globe" text={personalInfo.website} />}
            </div>
          </section>

          {skills.length > 0 && (
            <section className={sectionStyle} onClick={() => onSectionClick?.('skills')}>
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#d4af37]/70 mb-6 flex items-center gap-3">
                <span className="w-4 h-[1px] bg-[#d4af37]/40"></span> Competências
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <span key={s.id} className="text-[9px] font-bold uppercase border border-white/10 px-3 py-1.5 rounded-sm hover:border-[#d4af37]/50 transition-colors bg-white/5">{s.name}</span>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section className={sectionStyle} onClick={() => onSectionClick?.('extras')}>
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#d4af37]/70 mb-6 flex items-center gap-3">
                <span className="w-4 h-[1px] bg-[#d4af37]/40"></span> Idiomas
              </h2>
              <div className="space-y-4">
                {languages.map(l => (
                  <div key={l.id}>
                    <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-widest">
                      <span>{l.name}</span>
                      <span className="text-[#d4af37] opacity-80">{l.level}</span>
                    </div>
                    <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.4)]" style={{ width: `${l.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-16 flex flex-col gap-12 overflow-hidden">
        <section className={sectionStyle} onClick={() => onSectionClick?.('summary')}>
          <div className="flex items-center gap-6 mb-6">
            <h2 className="text-[12px] font-black text-[#0c1221] uppercase tracking-[0.3em] whitespace-nowrap">Perfil Executivo</h2>
            <div className="w-full h-[1px] bg-slate-100"></div>
          </div>
          <p className="text-[12px] leading-relaxed text-slate-600 font-medium italic text-justify pl-8 border-l-2 border-[#d4af37]/40">
            {summary || 'Profissional altamente qualificado com foco em resultados e liderança estratégica...'}
          </p>
        </section>

        {experiences.length > 0 && (
          <section className={sectionStyle} onClick={() => onSectionClick?.('experience')}>
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-[12px] font-black text-[#0c1221] uppercase tracking-[0.3em] whitespace-nowrap">Trajetória Profissional</h2>
              <div className="w-full h-[1px] bg-slate-100"></div>
            </div>
            <div className="space-y-10">
              {experiences.map(exp => (
                <div key={exp.id} className="relative group">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-serif-premium text-[#0c1221] text-lg uppercase tracking-tight group-hover:text-[#d4af37] transition-colors">{exp.position}</h3>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.company}</p>
                     <div className="w-2 h-[1px] bg-[#d4af37]"></div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed text-justify">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-10">
          {education.length > 0 && (
            <section className={sectionStyle} onClick={() => onSectionClick?.('education')}>
              <div className="flex items-center gap-6 mb-8">
                <h2 className="text-[11px] font-black text-[#0c1221] uppercase tracking-[0.3em] whitespace-nowrap">Formação</h2>
                <div className="w-full h-[1px] bg-slate-100"></div>
              </div>
              <div className="space-y-8">
                {education.map(edu => (
                  <div key={edu.id} className="hover:translate-x-1 transition-transform">
                    <h4 className="font-serif-premium text-[#0c1221] text-sm uppercase mb-1">{edu.institution}</h4>
                    <p className="text-[10px] text-slate-400 font-bold italic tracking-tight">{edu.degree}</p>
                    <p className="text-[9px] text-[#d4af37] font-black mt-2 tracking-[0.1em]">{edu.startDate} — {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {courses && courses.length > 0 && (
            <section className={sectionStyle} onClick={() => onSectionClick?.('extras')}>
              <div className="flex items-center gap-6 mb-8">
                <h2 className="text-[11px] font-black text-[#0c1221] uppercase tracking-[0.3em] whitespace-nowrap">Cursos</h2>
                <div className="w-full h-[1px] bg-slate-100"></div>
              </div>
              <div className="space-y-6">
                {courses.map(course => (
                  <div key={course.id}>
                    <h4 className="font-bold text-[#0c1221] text-[10px] uppercase tracking-tight">{course.name}</h4>
                    <p className="text-[9px] text-slate-400">{course.institution} • {course.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  // TEMPLATE: MODERN VITAE (Espaçoso e Moderno)
  const renderModernVitae = () => (
    <div id="resume-preview" className={`${a4ContainerStyle} bg-[#fcfdfd] text-slate-800 p-16`}>
      <header className={`flex items-center justify-between mb-16 border-b border-slate-100 pb-12 ${sectionStyle}`} onClick={() => onSectionClick?.('info')}>
        <div className="max-w-[65%]">
           <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none mb-3">{personalInfo.fullName || 'Seu Nome'}</h1>
           <p className="text-lg font-bold text-blue-600 uppercase tracking-widest">{personalInfo.jobTitle || 'Profissional'}</p>
           <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-[11px] font-medium text-slate-400">
             <span><i className="fas fa-envelope mr-2"></i>{personalInfo.email}</span>
             <span><i className="fas fa-phone mr-2"></i>{personalInfo.phone}</span>
             <span><i className="fas fa-map-marker-alt mr-2"></i>{personalInfo.location}</span>
             {personalInfo.linkedin && <span><i className="fab fa-linkedin mr-2"></i>{personalInfo.linkedin}</span>}
           </div>
        </div>
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-2xl ring-4 ring-white shrink-0">
          {personalInfo.photoUrl ? (
            <img src={personalInfo.photoUrl} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300"><i className="fas fa-user text-2xl"></i></div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-16 flex-1 overflow-hidden">
        <div className="col-span-8 space-y-12">
          <section className={sectionStyle} onClick={() => onSectionClick?.('summary')}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-blue-600"></span> Perfil
            </h2>
            <p className="text-[11px] leading-relaxed text-slate-600 font-medium">{summary}</p>
          </section>

          <section className={sectionStyle} onClick={() => onSectionClick?.('experience')}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-4">
              <span className="w-8 h-[2px] bg-blue-600"></span> Experiência
            </h2>
            <div className="space-y-10">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">{exp.position}</h3>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-[10px] font-bold text-blue-500 mb-3">{exp.company}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed text-justify">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          {courses && courses.length > 0 && (
            <section className={sectionStyle} onClick={() => onSectionClick?.('extras')}>
               <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-4">
                 <span className="w-8 h-[2px] bg-blue-600"></span> Especializações
               </h2>
               <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                 {courses.map(course => (
                    <div key={course.id}>
                       <h4 className="font-bold text-[10px] text-slate-800">{course.name}</h4>
                       <p className="text-[9px] text-slate-400">{course.institution}, {course.year}</p>
                    </div>
                 ))}
               </div>
            </section>
          )}
        </div>

        <div className="col-span-4 space-y-10">
          <section className={sectionStyle} onClick={() => onSectionClick?.('skills')}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s.id} className="text-[10px] font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50">{s.name}</span>
              ))}
            </div>
          </section>

          <section className={sectionStyle} onClick={() => onSectionClick?.('education')}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Educação</h2>
            <div className="space-y-6">
              {education.map(edu => (
                <div key={edu.id}>
                  <h4 className="font-bold text-slate-900 text-[11px]">{edu.institution}</h4>
                  <p className="text-[10px] text-slate-400 italic font-medium">{edu.degree}</p>
                  <p className="text-[9px] text-slate-300 mt-1">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>

          {languages.length > 0 && (
            <section className={sectionStyle} onClick={() => onSectionClick?.('extras')}>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Idiomas</h2>
              <div className="space-y-2">
                {languages.map(l => (
                  <div key={l.id} className="flex justify-between items-center text-[10px]">
                    <span className="font-bold">{l.name}</span>
                    <span className="text-slate-400">{l.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  // TEMPLATE: MODERN BLUE (Completo com Educação e Idiomas)
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
          <h1 className="text-xl font-black uppercase tracking-tight">{personalInfo.fullName || 'Seu Nome'}</h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-80 mt-2">{personalInfo.jobTitle || 'Seu Cargo'}</p>
        </div>
        
        <div className="space-y-10">
           <section className={sectionStyle} onClick={() => onSectionClick?.('info')}>
              <h2 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">Contato</h2>
              <div className="space-y-3">
                <ContactInfo icon="fa-phone" text={personalInfo.phone} />
                <ContactInfo icon="fa-envelope" text={personalInfo.email} />
                <ContactInfo icon="fa-map-marker-alt" text={personalInfo.location} />
                {personalInfo.linkedin && <ContactInfo icon="fab fa-linkedin" text={personalInfo.linkedin} />}
              </div>
           </section>

           {skills.length > 0 && (
             <section className={sectionStyle} onClick={() => onSectionClick?.('skills')}>
                <h2 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">Habilidades</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map(s => <span key={s.id} className="bg-white/10 px-2 py-1 rounded text-[9px] font-bold">{s.name}</span>)}
                </div>
             </section>
           )}

           {languages.length > 0 && (
             <section className={sectionStyle} onClick={() => onSectionClick?.('extras')}>
                <h2 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">Idiomas</h2>
                <div className="space-y-2">
                  {languages.map(l => (
                    <div key={l.id} className="flex justify-between text-[10px]">
                      <span>{l.name}</span>
                      <span className="opacity-60">{l.level}</span>
                    </div>
                  ))}
                </div>
             </section>
           )}
        </div>
      </div>

      <div className="flex-1 p-16 bg-white overflow-hidden">
        {/* Fix duplicate className attribute by merging them */}
        <section className={`${sectionStyle} mb-12`} onClick={() => onSectionClick?.('summary')}>
           <h2 className="text-sm font-black text-blue-800 uppercase mb-4 border-b-2 border-blue-100 pb-2">Perfil Profissional</h2>
           <p className="text-xs text-slate-600 leading-relaxed">{summary}</p>
        </section>

        {/* Fix duplicate className attribute by merging them */}
        <section className={`${sectionStyle} mb-12`} onClick={() => onSectionClick?.('experience')}>
          <h2 className="text-sm font-black text-blue-800 uppercase mb-8 border-b-2 border-blue-100 pb-2">Experiência Profissional</h2>
          <div className="space-y-8">
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-slate-900 mb-1">
                  <h3>{exp.position}</h3>
                  <span className="text-[9px] text-slate-400">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-xs text-blue-600 font-bold mb-3">{exp.company}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fix duplicate className attribute by merging them */}
        {education.length > 0 && (
          <section className={`${sectionStyle} mb-12`} onClick={() => onSectionClick?.('education')}>
             <h2 className="text-sm font-black text-blue-800 uppercase mb-6 border-b-2 border-blue-100 pb-2">Educação</h2>
             <div className="space-y-6">
                {education.map(edu => (
                  <div key={edu.id}>
                    <h4 className="font-bold text-slate-900 text-xs">{edu.institution}</h4>
                    <p className="text-xs text-slate-500">{edu.degree}</p>
                  </div>
                ))}
             </div>
          </section>
        )}

        {courses && courses.length > 0 && (
          <section className={sectionStyle} onClick={() => onSectionClick?.('extras')}>
             <h2 className="text-sm font-black text-blue-800 uppercase mb-6 border-b-2 border-blue-100 pb-2">Cursos e Certificados</h2>
             <ul className="list-disc list-inside space-y-2">
                {courses.map(course => (
                   <li key={course.id} className="text-xs text-slate-500">
                     <span className="font-bold text-slate-700">{course.name}</span> — {course.institution}
                   </li>
                ))}
             </ul>
          </section>
        )}
      </div>
    </div>
  );

  // Mapeamentos de modelos adicionais com correções rápidas
  const renderClassicSerif = () => (
    <div id="resume-preview" className={`${a4ContainerStyle} font-serif p-16 text-center`}>
      <header className={`mb-12 border-b-4 border-double border-slate-900 pb-8 ${sectionStyle}`} onClick={() => onSectionClick?.('info')}>
        <h1 className="text-4xl font-bold uppercase tracking-widest">{personalInfo.fullName}</h1>
        <p className="text-sm italic text-slate-500 mt-2">{personalInfo.jobTitle}</p>
        <div className="mt-4 flex justify-center gap-6 text-[10px] uppercase font-sans font-bold">
           <span>{personalInfo.email}</span>
           <span>|</span>
           <span>{personalInfo.phone}</span>
           <span>|</span>
           <span>{personalInfo.location}</span>
        </div>
      </header>
      <div className="text-left space-y-10">
         <section className={sectionStyle} onClick={() => onSectionClick?.('summary')}>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-4 border-b border-slate-200">Sobre</h2>
            <p className="text-xs text-justify italic">{summary}</p>
         </section>

         <section className={sectionStyle} onClick={() => onSectionClick?.('experience')}>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 border-b border-slate-200">Experiência Profissional</h2>
            {experiences.map(exp => (
              <div key={exp.id} className="mb-6">
                <div className="flex justify-between font-bold text-sm">
                  <span>{exp.position}</span>
                  <span className="font-sans text-[10px]">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="italic text-slate-600 text-sm">{exp.company}</p>
                <p className="text-xs mt-2 text-justify font-sans leading-relaxed">{exp.description}</p>
              </div>
            ))}
         </section>

         <div className="grid grid-cols-2 gap-10">
            {education.length > 0 && (
              <section className={sectionStyle} onClick={() => onSectionClick?.('education')}>
                 <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-4 border-b border-slate-200">Educação</h2>
                 {education.map(edu => (
                   <div key={edu.id} className="mb-4">
                      <p className="font-bold text-xs">{edu.institution}</p>
                      <p className="italic text-[11px]">{edu.degree}</p>
                   </div>
                 ))}
              </section>
            )}

            {skills.length > 0 && (
              <section className={sectionStyle} onClick={() => onSectionClick?.('skills')}>
                 <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-4 border-b border-slate-200">Habilidades</h2>
                 <p className="text-[11px] font-sans flex flex-wrap gap-x-3 gap-y-1">
                    {skills.map(s => <span key={s.id}>• {s.name}</span>)}
                 </p>
              </section>
            )}
         </div>
      </div>
    </div>
  );

  // Implementação padrão de queda para modelos simplistas
  const renderFallback = (content: React.ReactNode) => (
     <div id="resume-preview" className={`${a4ContainerStyle} p-12 overflow-hidden`}>
        {content}
     </div>
  );

  switch(template) {
    case 'modern_blue': return renderModernBlue();
    case 'executive_navy': return renderExecutiveNavy();
    case 'modern_vitae': return renderModernVitae();
    case 'classic_serif': return renderClassicSerif();
    case 'swiss_minimal': return renderExecutiveNavy(); // Usando Navy como fallback de alta qualidade
    case 'teal_sidebar': return renderModernBlue(); // Usando Modern Blue como fallback
    case 'executive_red': return renderExecutiveNavy();
    case 'corporate_gray': return renderModernVitae();
    case 'minimal_red_line': return renderModernVitae();
    default: return renderModernBlue();
  }
};

export default ResumePreview;

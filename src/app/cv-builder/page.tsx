'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import Link from 'next/link';

type CVSection = 'personal' | 'experience' | 'education' | 'skills' | 'certifications' | 'languages' | 'projects' | 'preview';

interface Experience { company: string; role: string; period: string; description: string; }
interface Education { institution: string; degree: string; period: string; }
interface Certification { name: string; issuer: string; year: string; }
interface Language { name: string; level: string; }
interface Project { name: string; description: string; tech: string; }

type TemplateStyle = 'modern' | 'professional' | 'minimal';

const FREE_TEMPLATE: TemplateStyle = 'minimal';
const PAID_TEMPLATES: TemplateStyle[] = ['modern', 'professional'];

export default function CVBuilderPage() {
  const { showToast, state, navigateTo } = useApp();
  const [section, setSection] = useState<CVSection>('personal');
  const [template, setTemplate] = useState<TemplateStyle>('minimal');
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedPaidTemplate, setSelectedPaidTemplate] = useState<TemplateStyle | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [personal, setPersonal] = useState(() => ({
    name: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '', summary: '',
  }));
  const [experiences, setExperiences] = useState<Experience[]>([{ company: '', role: '', period: '', description: '' }]);
  const [education, setEducation] = useState<Education[]>([{ institution: '', degree: '', period: '' }]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [certifications, setCertifications] = useState<Certification[]>([{ name: '', issuer: '', year: '' }]);
  const [languages, setLanguages] = useState<Language[]>([{ name: '', level: '' }]);
  const [projects, setProjects] = useState<Project[]>([{ name: '', description: '', tech: '' }]);

  const addEntry = <T,>(list: T[], setter: (v: T[]) => void, empty: T) => setter([...list, { ...empty }]);
  const removeEntry = <T,>(list: T[], setter: (v: T[]) => void, idx: number) => setter(list.filter((_, i) => i !== idx));
  const updateEntry = <T,>(list: T[], setter: (v: T[]) => void, idx: number, val: T) => setter(list.map((e, i) => i === idx ? val : e));

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const sections: { id: CVSection; label: string; icon: string }[] = [
    { id: 'personal', label: 'Personal Info', icon: 'fa-user' },
    { id: 'experience', label: 'Experience', icon: 'fa-briefcase' },
    { id: 'education', label: 'Education', icon: 'fa-graduation-cap' },
    { id: 'skills', label: 'Skills', icon: 'fa-cogs' },
    { id: 'certifications', label: 'Certifications', icon: 'fa-certificate' },
    { id: 'languages', label: 'Languages', icon: 'fa-language' },
    { id: 'projects', label: 'Projects', icon: 'fa-project-diagram' },
    { id: 'preview', label: 'Preview', icon: 'fa-eye' },
  ];

  // ─── Template selection with paywall ───
  const handleSelectTemplate = (t: TemplateStyle) => {
    if (t === FREE_TEMPLATE) {
      setTemplate(t);
      return;
    }
    if (!state.user) {
      setSelectedPaidTemplate(t);
      setShowPaywall(true);
      return;
    }
    // Logged-in user: show upgrade paywall (future: check subscription)
    setSelectedPaidTemplate(t);
    setShowPaywall(true);
  };

  const handlePrint = () => {
    setSection('preview');
    setTimeout(() => window.print(), 400);
  };

  const handleDownloadPDF = () => {
    showToast('Select "Save as PDF" in the print dialog', 'info');
    handlePrint();
  };

  const progress = (sections.findIndex(s => s.id === section) + 1) / sections.length * 100;

  return (
    <>
      {/* Print-only CSS: hide everything except #cv-preview */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #cv-preview, #cv-preview * { visibility: visible; }
          #cv-preview { position: absolute; left: 0; top: 0; width: 100%; }
          @page { margin: 0; size: A4; }
        }
      `}</style>

      <div className="page-transition min-h-screen pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <i className="fas fa-file-pen mr-3 text-[#22c55e]"></i>CV Builder
              </h1>
              <p className="text-gray-500 mt-1">Build a professional CV that gets you hired</p>
            </div>
            <button onClick={handleDownloadPDF} className="px-6 py-3 rounded-xl accent-gradient text-white font-medium text-sm">
              <i className="fas fa-download mr-2"></i>Download PDF
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
            <div className="accent-gradient h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>

          {/* Section tabs */}
          <div className="glass rounded-2xl p-1.5 mb-6 inline-flex flex-wrap">
            {sections.map(s => (
              <button key={s.id} onClick={() => setSection(s.id)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${section === s.id ? 'accent-gradient text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}>
                <i className={`fas ${s.icon} mr-2`}></i>{s.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* ─── FORM ─── */}
            <div className="lg:w-1/2">
              {/* ─── PERSONAL ─── */}
              {section === 'personal' && (
                <div className="glass rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4"><i className="fas fa-user mr-2 text-[#22c55e]"></i>Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input value={personal.name} onChange={e => setPersonal({ ...personal, name: e.target.value })} placeholder="John Doe" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" /></div>
                    <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label><input value={personal.title} onChange={e => setPersonal({ ...personal, title: e.target.value })} placeholder="Software Engineer" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input value={personal.email} onChange={e => setPersonal({ ...personal, email: e.target.value })} placeholder="john@email.com" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input value={personal.phone} onChange={e => setPersonal({ ...personal, phone: e.target.value })} placeholder="+234 800 000 0000" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" /></div>
                    <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input value={personal.location} onChange={e => setPersonal({ ...personal, location: e.target.value })} placeholder="Lagos, Nigeria" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label><textarea value={personal.summary} onChange={e => setPersonal({ ...personal, summary: e.target.value })} rows={4} placeholder="A brief overview of your career..." className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors resize-none"></textarea></div>
                  <div className="flex justify-end mt-4"><button onClick={() => setSection('experience')} className="px-6 py-3 rounded-xl accent-gradient text-white font-medium text-sm">Next: Experience <i className="fas fa-arrow-right ml-2"></i></button></div>
                </div>
              )}

              {/* ─── EXPERIENCE ─── */}
              {section === 'experience' && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4"><i className="fas fa-briefcase mr-2 text-[#22c55e]"></i>Experience</h3>
                  {experiences.map((exp, i) => (
                    <div key={i} className="mb-4 p-4 bg-white rounded-xl border border-gray-100 relative">
                      {experiences.length > 1 && <button onClick={() => removeEntry(experiences, setExperiences, i)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-100 text-red-500 text-xs hover:bg-red-200"><i className="fas fa-times"></i></button>}
                      <div className="grid grid-cols-2 gap-3">
                        <input value={exp.company} onChange={e => updateEntry(experiences, setExperiences, i, { ...exp, company: e.target.value })} placeholder="Company" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" />
                        <input value={exp.role} onChange={e => updateEntry(experiences, setExperiences, i, { ...exp, role: e.target.value })} placeholder="Role" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" />
                        <input value={exp.period} onChange={e => updateEntry(experiences, setExperiences, i, { ...exp, period: e.target.value })} placeholder="Jan 2022 - Present" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" />
                      </div>
                      <textarea value={exp.description} onChange={e => updateEntry(experiences, setExperiences, i, { ...exp, description: e.target.value })} rows={3} placeholder="Describe your responsibilities and achievements..." className="w-full mt-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors resize-none"></textarea>
                    </div>
                  ))}
                  <button onClick={() => addEntry(experiences, setExperiences, { company: '', role: '', period: '', description: '' })} className="text-sm text-[#22c55e] hover:underline"><i className="fas fa-plus mr-1"></i>Add Experience</button>
                  <div className="flex justify-between mt-6">
                    <button onClick={() => setSection('personal')} className="px-4 py-2 text-gray-500 hover:text-gray-900 text-sm"><i className="fas fa-arrow-left mr-2"></i>Personal</button>
                    <button onClick={() => setSection('education')} className="px-6 py-3 rounded-xl accent-gradient text-white font-medium text-sm">Next: Education <i className="fas fa-arrow-right ml-2"></i></button>
                  </div>
                </div>
              )}

              {/* ─── EDUCATION ─── */}
              {section === 'education' && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4"><i className="fas fa-graduation-cap mr-2 text-[#22c55e]"></i>Education</h3>
                  {education.map((edu, i) => (
                    <div key={i} className="mb-4 p-4 bg-white rounded-xl border border-gray-100 relative">
                      {education.length > 1 && <button onClick={() => removeEntry(education, setEducation, i)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-100 text-red-500 text-xs hover:bg-red-200"><i className="fas fa-times"></i></button>}
                      <div className="grid grid-cols-2 gap-3">
                        <input value={edu.institution} onChange={e => updateEntry(education, setEducation, i, { ...edu, institution: e.target.value })} placeholder="Institution" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" />
                        <input value={edu.degree} onChange={e => updateEntry(education, setEducation, i, { ...edu, degree: e.target.value })} placeholder="B.Sc. Computer Science" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" />
                        <input value={edu.period} onChange={e => updateEntry(education, setEducation, i, { ...edu, period: e.target.value })} placeholder="2018 - 2022" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" />
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addEntry(education, setEducation, { institution: '', degree: '', period: '' })} className="text-sm text-[#22c55e] hover:underline"><i className="fas fa-plus mr-1"></i>Add Education</button>
                  <div className="flex justify-between mt-6">
                    <button onClick={() => setSection('experience')} className="px-4 py-2 text-gray-500 hover:text-gray-900 text-sm"><i className="fas fa-arrow-left mr-2"></i>Experience</button>
                    <button onClick={() => setSection('skills')} className="px-6 py-3 rounded-xl accent-gradient text-white font-medium text-sm">Next: Skills <i className="fas fa-arrow-right ml-2"></i></button>
                  </div>
                </div>
              )}

              {/* ─── SKILLS ─── */}
              {section === 'skills' && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4"><i className="fas fa-cogs mr-2 text-[#22c55e]"></i>Skills</h3>
                  <div className="flex gap-2 mb-4">
                    <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSkill()} placeholder="Add a skill..." className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" />
                    <button onClick={handleAddSkill} className="px-4 py-2.5 rounded-xl accent-gradient text-white text-sm font-medium"><i className="fas fa-plus"></i></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#22c55e]/10 text-[#22c55e] text-sm font-medium">
                        {s}
                        <button onClick={() => setSkills(skills.filter((_, j) => j !== i))} className="w-4 h-4 rounded-full bg-[#22c55e]/20 flex items-center justify-center hover:bg-[#22c55e]/30"><i className="fas fa-times text-[10px]"></i></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button onClick={() => setSection('education')} className="px-4 py-2 text-gray-500 hover:text-gray-900 text-sm"><i className="fas fa-arrow-left mr-2"></i>Education</button>
                    <button onClick={() => setSection('certifications')} className="px-6 py-3 rounded-xl accent-gradient text-white font-medium text-sm">Next: Certifications <i className="fas fa-arrow-right ml-2"></i></button>
                  </div>
                </div>
              )}

              {/* ─── CERTIFICATIONS ─── */}
              {section === 'certifications' && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4"><i className="fas fa-certificate mr-2 text-[#22c55e]"></i>Certifications</h3>
                  {certifications.map((cert, i) => (
                    <div key={i} className="mb-4 p-4 bg-white rounded-xl border border-gray-100 relative">
                      {certifications.length > 1 && <button onClick={() => removeEntry(certifications, setCertifications, i)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-100 text-red-500 text-xs hover:bg-red-200"><i className="fas fa-times"></i></button>}
                      <div className="grid grid-cols-3 gap-3">
                        <input value={cert.name} onChange={e => updateEntry(certifications, setCertifications, i, { ...cert, name: e.target.value })} placeholder="Certification Name" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" />
                        <input value={cert.issuer} onChange={e => updateEntry(certifications, setCertifications, i, { ...cert, issuer: e.target.value })} placeholder="Issuer" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" />
                        <input value={cert.year} onChange={e => updateEntry(certifications, setCertifications, i, { ...cert, year: e.target.value })} placeholder="Year" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" />
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addEntry(certifications, setCertifications, { name: '', issuer: '', year: '' })} className="text-sm text-[#22c55e] hover:underline"><i className="fas fa-plus mr-1"></i>Add Certification</button>
                  <div className="flex justify-between mt-6">
                    <button onClick={() => setSection('skills')} className="px-4 py-2 text-gray-500 hover:text-gray-900 text-sm"><i className="fas fa-arrow-left mr-2"></i>Skills</button>
                    <button onClick={() => setSection('languages')} className="px-6 py-3 rounded-xl accent-gradient text-white font-medium text-sm">Next: Languages <i className="fas fa-arrow-right ml-2"></i></button>
                  </div>
                </div>
              )}

              {/* ─── LANGUAGES ─── */}
              {section === 'languages' && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4"><i className="fas fa-language mr-2 text-[#22c55e]"></i>Languages</h3>
                  {languages.map((lang, i) => (
                    <div key={i} className="mb-4 p-4 bg-white rounded-xl border border-gray-100 relative">
                      {languages.length > 1 && <button onClick={() => removeEntry(languages, setLanguages, i)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-100 text-red-500 text-xs hover:bg-red-200"><i className="fas fa-times"></i></button>}
                      <div className="grid grid-cols-2 gap-3">
                        <input value={lang.name} onChange={e => updateEntry(languages, setLanguages, i, { ...lang, name: e.target.value })} placeholder="English" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" />
                        <select value={lang.level} onChange={e => updateEntry(languages, setLanguages, i, { ...lang, level: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors">
                          <option value="">Select level</option>
                          <option value="Native">Native</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Basic">Basic</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addEntry(languages, setLanguages, { name: '', level: '' })} className="text-sm text-[#22c55e] hover:underline"><i className="fas fa-plus mr-1"></i>Add Language</button>
                  <div className="flex justify-between mt-6">
                    <button onClick={() => setSection('certifications')} className="px-4 py-2 text-gray-500 hover:text-gray-900 text-sm"><i className="fas fa-arrow-left mr-2"></i>Certifications</button>
                    <button onClick={() => setSection('projects')} className="px-6 py-3 rounded-xl accent-gradient text-white font-medium text-sm">Next: Projects <i className="fas fa-arrow-right ml-2"></i></button>
                  </div>
                </div>
              )}

              {/* ─── PROJECTS ─── */}
              {section === 'projects' && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4"><i className="fas fa-project-diagram mr-2 text-[#22c55e]"></i>Projects</h3>
                  {projects.map((proj, i) => (
                    <div key={i} className="mb-4 p-4 bg-white rounded-xl border border-gray-100 relative">
                      {projects.length > 1 && <button onClick={() => removeEntry(projects, setProjects, i)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-100 text-red-500 text-xs hover:bg-red-200"><i className="fas fa-times"></i></button>}
                      <div className="space-y-3">
                        <input value={proj.name} onChange={e => updateEntry(projects, setProjects, i, { ...proj, name: e.target.value })} placeholder="Project Name" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" />
                        <textarea value={proj.description} onChange={e => updateEntry(projects, setProjects, i, { ...proj, description: e.target.value })} rows={2} placeholder="Brief description..." className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors resize-none"></textarea>
                        <input value={proj.tech} onChange={e => updateEntry(projects, setProjects, i, { ...proj, tech: e.target.value })} placeholder="React, Node.js, MongoDB" className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#22c55e] focus:outline-none transition-colors" />
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addEntry(projects, setProjects, { name: '', description: '', tech: '' })} className="text-sm text-[#22c55e] hover:underline"><i className="fas fa-plus mr-1"></i>Add Project</button>
                  <div className="flex justify-between mt-6">
                    <button onClick={() => setSection('languages')} className="px-4 py-2 text-gray-500 hover:text-gray-900 text-sm"><i className="fas fa-arrow-left mr-2"></i>Languages</button>
                    <button onClick={() => setSection('preview')} className="px-6 py-3 rounded-xl accent-gradient text-white font-medium text-sm">View Preview <i className="fas fa-eye ml-2"></i></button>
                  </div>
                </div>
              )}
            </div>

            {/* ─── PREVIEW ─── */}
            <div className="lg:w-1/2">
              {section === 'preview' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">CV Preview</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 font-medium">Template:</span>
                      {(['modern', 'professional', 'minimal'] as TemplateStyle[]).map(t => (
                        <button key={t} onClick={() => handleSelectTemplate(t)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${template === t ? 'accent-gradient text-white shadow-md' : 'glass text-gray-500 hover:text-gray-900'}`}>
                          {t}
                          {t !== FREE_TEMPLATE && <span className="ml-1.5 text-[10px] opacity-70">PRO</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CV Preview Container */}
                  <div ref={previewRef} id="cv-preview" className="bg-white rounded-2xl shadow-lg p-8 min-h-[600px]">
                    {template === 'modern' && (
                      <div className="font-sans">
                        <div className="text-center mb-6">
                          <h2 className="text-2xl font-bold text-gray-900">{personal.name || 'Your Name'}</h2>
                          <p className="text-gray-500">{personal.title || 'Professional Title'}</p>
                          <div className="flex justify-center gap-4 text-xs text-gray-400 mt-2">
                            {personal.email && <span><i className="fas fa-envelope mr-1"></i>{personal.email}</span>}
                            {personal.phone && <span><i className="fas fa-phone mr-1"></i>{personal.phone}</span>}
                            {personal.location && <span><i className="fas fa-map-marker-alt mr-1"></i>{personal.location}</span>}
                          </div>
                        </div>
                        {personal.summary && <p className="text-gray-600 text-sm mb-6 text-center italic">{personal.summary}</p>}
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">Experience</h3>
                            {experiences.filter(e => e.company).map((exp, i) => (
                              <div key={i} className="mb-3"><p className="font-semibold text-gray-900">{exp.role}</p><p className="text-sm text-[#22c55e]">{exp.company}</p><p className="text-xs text-gray-400 mb-1">{exp.period}</p><p className="text-gray-500 text-xs">{exp.description}</p></div>
                            ))}
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 mt-6 border-b border-gray-200 pb-1">Education</h3>
                            {education.filter(e => e.institution).map((edu, i) => (
                              <div key={i} className="mb-2"><p className="font-semibold text-gray-900">{edu.degree}</p><p className="text-sm text-gray-500">{edu.institution} <span className="text-gray-400">({edu.period})</span></p></div>
                            ))}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">Skills</h3>
                            <div className="flex flex-wrap gap-2 mb-6">{skills.map(s => <span key={s} className="px-3 py-1.5 rounded-full bg-[#22c55e]/10 text-[#22c55e] text-sm font-medium">{s}</span>)}</div>
                            {certifications.some(c => c.name) && <><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">Certifications</h3>{certifications.filter(c => c.name).map((c, i) => (<div key={i} className="mb-1"><p className="font-medium text-gray-900 text-sm">{c.name}</p><p className="text-xs text-gray-500">{c.issuer} · {c.year}</p></div>))}</>}
                            {projects.some(p => p.name) && <><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 mt-6 border-b border-gray-200 pb-1">Projects</h3>{projects.filter(p => p.name).map((p, i) => (<div key={i} className="mb-2"><p className="font-semibold text-gray-900 text-sm">{p.name}</p><p className="text-xs text-gray-500 mb-0.5">{p.description}</p><p className="text-xs text-gray-400">{p.tech}</p></div>))}</>}
                          </div>
                        </div>
                      </div>
                    )}

                    {template === 'professional' && (
                      <div className="font-sans">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 uppercase">{personal.name?.charAt(0) || '?'}</div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">{personal.name || 'Your Name'}</h2>
                            <p className="text-gray-500">{personal.title || 'Professional Title'}</p>
                            <div className="flex gap-3 text-xs text-gray-400 mt-1">
                              {personal.email && <span><i className="fas fa-envelope mr-1"></i>{personal.email}</span>}
                              {personal.phone && <span><i className="fas fa-phone mr-1"></i>{personal.phone}</span>}
                              {personal.location && <span><i className="fas fa-map-marker-alt mr-1"></i>{personal.location}</span>}
                            </div>
                          </div>
                        </div>
                        {personal.summary && <div className="bg-gray-50 rounded-xl p-4 mb-6"><p className="text-gray-600 text-sm">{personal.summary}</p></div>}
                        <div className="space-y-5">
                          <div><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-900 pb-1 mb-3">Experience</h3>{experiences.filter(e => e.company).map((exp, i) => (<div key={i} className="mb-3"><div className="flex justify-between items-start"><div><p className="font-semibold text-gray-900">{exp.role}</p><p className="text-sm text-gray-500">{exp.company}</p></div><span className="text-xs text-gray-400 whitespace-nowrap">{exp.period}</span></div><p className="text-gray-500 text-xs mt-1">{exp.description}</p></div>))}</div>
                          <div><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-900 pb-1 mb-3">Education</h3>{education.filter(e => e.institution).map((edu, i) => (<div key={i} className="mb-2"><p className="font-semibold text-gray-900">{edu.degree}</p><p className="text-sm text-gray-500">{edu.institution} <span className="text-gray-400">({edu.period})</span></p></div>))}</div>
                          {skills.length > 0 && <div><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-900 pb-1 mb-3">Skills</h3><div className="flex flex-wrap gap-2">{skills.map(s => <span key={s} className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">{s}</span>)}</div></div>}
                          {certifications.some(c => c.name) && <div><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-900 pb-1 mb-3">Certifications</h3>{certifications.filter(c => c.name).map((c, i) => (<div key={i} className="mb-1 flex justify-between"><p className="font-medium text-gray-900 text-sm">{c.name}</p><p className="text-xs text-gray-500">{c.issuer} · {c.year}</p></div>))}</div>}
                          {projects.some(p => p.name) && <div><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-900 pb-1 mb-3">Projects</h3>{projects.filter(p => p.name).map((p, i) => (<div key={i} className="mb-2"><p className="font-semibold text-gray-900 text-sm">{p.name}</p><p className="text-xs text-gray-500">{p.description}</p><p className="text-xs text-gray-400">{p.tech}</p></div>))}</div>}
                          {languages.some(l => l.name) && <div><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-900 pb-1 mb-3">Languages</h3><div className="flex flex-wrap gap-2">{languages.filter(l => l.name).map((l, i) => (<span key={i} className="text-sm text-gray-600">{l.name} ({l.level})</span>))}</div></div>}
                        </div>
                      </div>
                    )}

                    {template === 'minimal' && (
                      <div className="font-sans max-w-[600px] mx-auto">
                        <div className="mb-6">
                          <h2 className="text-xl font-bold text-gray-900">{personal.name || 'Your Name'}</h2>
                          <p className="text-sm text-gray-500">{personal.title || 'Professional Title'}</p>
                          <div className="text-xs text-gray-400 mt-1 space-x-3">
                            {personal.email && <span>{personal.email}</span>}
                            {personal.phone && <span>{personal.phone}</span>}
                            {personal.location && <span>{personal.location}</span>}
                          </div>
                        </div>
                        {personal.summary && <p className="text-gray-600 text-sm mb-4">{personal.summary}</p>}
                        <hr className="border-gray-200 mb-4" />
                        <div className="space-y-4">
                          <div><h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Experience</h3>{experiences.filter(e => e.company).map((exp, i) => (<div key={i} className="mb-3"><p className="font-semibold text-gray-900 text-sm">{exp.role} — {exp.company}</p><p className="text-xs text-gray-400">{exp.period}</p><p className="text-gray-500 text-xs mt-0.5">{exp.description}</p></div>))}</div>
                          <div><h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Education</h3>{education.filter(e => e.institution).map((edu, i) => (<div key={i} className="mb-1"><p className="text-sm text-gray-900"><span className="font-semibold">{edu.degree}</span> — {edu.institution} <span className="text-gray-400">({edu.period})</span></p></div>))}</div>
                          {skills.length > 0 && <div><h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">Skills</h3><p className="text-sm text-gray-600">{skills.join(', ')}</p></div>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Paywall Modal */}
                  {showPaywall && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
                      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
                        <div className="w-16 h-16 rounded-full bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-crown text-2xl text-[#22c55e]"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Unlock {selectedPaidTemplate} Template</h3>
                        <p className="text-gray-500 mb-6">
                          {!state.user
                            ? 'Sign in to access premium CV templates and advanced features.'
                            : 'Upgrade your account to access the Professional and Modern CV templates.'}
                        </p>
                        <div className="flex gap-3 justify-center">
                          {!state.user ? (
                            <>
                              <Link href="/auth/login" className="px-6 py-3 rounded-xl accent-gradient text-white font-medium text-sm">
                                <i className="fas fa-sign-in-alt mr-2"></i>Sign In
                              </Link>
                              <button onClick={() => setShowPaywall(false)} className="px-6 py-3 rounded-xl glass text-gray-500 font-medium text-sm">
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <Link href="/store?category=CV Services" className="px-6 py-3 rounded-xl accent-gradient text-white font-medium text-sm">
                                <i className="fas fa-shopping-cart mr-2"></i>Upgrade Now
                              </Link>
                              <button onClick={() => setShowPaywall(false)} className="px-6 py-3 rounded-xl glass text-gray-500 font-medium text-sm">
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Download & Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button onClick={handleDownloadPDF} className="flex-1 px-6 py-3 rounded-xl accent-gradient text-white font-medium text-sm">
                      <i className="fas fa-download mr-2"></i>Download PDF
                    </button>
                    <button onClick={handlePrint} className="px-6 py-3 rounded-xl glass text-gray-500 hover:text-gray-900 font-medium text-sm">
                      <i className="fas fa-print mr-2"></i>Print
                    </button>
                  </div>

                  {/* Need a Portfolio? Callout */}
                  <div className="mt-8 p-6 bg-gradient-to-br from-[#22c55e]/5 to-[#16a34a]/5 rounded-2xl border border-[#22c55e]/10">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-folder-open text-[#22c55e]"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Need a Portfolio?</h4>
                        <p className="text-sm text-gray-500 mb-3">Pair your CV with a professional portfolio site. Get pre-designed templates for developers, designers, and creatives.</p>
                        <Link href="/store?category=General Tests" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#22c55e] text-white text-sm font-medium hover:bg-[#16a34a] transition-colors">
                          <i className="fas fa-shopping-bag"></i>Browse Portfolio Templates
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Navigation buttons for form */}
                  <div className="flex justify-between mt-6">
                    <button onClick={() => setSection('projects')} className="px-4 py-2 text-gray-500 hover:text-gray-900 text-sm"><i className="fas fa-arrow-left mr-2"></i>Projects</button>
                    <span className="text-xs text-gray-400 self-center">Step 8 of 8</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import AdminLogin from './AdminLogin';
import './Admin.css';

export default function AdminPanel() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    // Data state
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [status, setStatus] = useState({ message: '', type: '' });

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session: s } }) => {
            setSession(s);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
            setSession(s);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (session) fetchAll();
    }, [session]);

    const fetchAll = async () => {
        const [profileRes, projectsRes, skillsRes, contactRes] = await Promise.all([
            supabase.from('profile').select('*').limit(1).single(),
            supabase.from('projects').select('*').order('sort_order'),
            supabase.from('skills').select('*').order('sort_order'),
            supabase.from('contact').select('*').order('sort_order'),
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (projectsRes.data) setProjects(projectsRes.data);
        if (skillsRes.data) setSkills(skillsRes.data);
        if (contactRes.data) setContacts(contactRes.data);
    };

    const showStatus = (message, type = 'success') => {
        setStatus({ message, type });
        setTimeout(() => setStatus({ message: '', type: '' }), 3000);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    // ---- Profile save ----
    const saveProfile = async () => {
        const { error } = await supabase
            .from('profile')
            .update({
                name: profile.name,
                status: profile.status,
                objective: profile.objective,
                bio: profile.bio,
                updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id);

        if (error) showStatus(`Error: ${error.message}`, 'error');
        else showStatus('Profile saved.');
    };

    // ---- Projects save ----
    const saveProject = async (project) => {
        if (project.isNew) {
            const { id, isNew, ...rest } = project;
            const { data, error } = await supabase.from('projects').insert({ ...rest, updated_at: new Date().toISOString() }).select().single();
            if (error) return showStatus(`Error: ${error.message}`, 'error');
            setProjects((prev) => prev.map((p) => (p.id === id ? data : p)));
            showStatus('Project created.');
        } else {
            const { isNew, ...rest } = project;
            const { error } = await supabase.from('projects').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', project.id);
            if (error) return showStatus(`Error: ${error.message}`, 'error');
            showStatus('Project saved.');
        }
    };

    const deleteProject = async (id, isNew) => {
        if (!isNew) {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (error) return showStatus(`Error: ${error.message}`, 'error');
        }
        setProjects((prev) => prev.filter((p) => p.id !== id));
        showStatus('Project removed.');
    };

    const addProject = () => {
        setProjects((prev) => [
            ...prev,
            { id: crypto.randomUUID(), slug: '', title: '', short_description: '', detail_bullets: [''], repo_url: '#', sort_order: prev.length + 1, isNew: true },
        ]);
    };

    // ---- Skills save ----
    const saveSkill = async (skill) => {
        if (skill.isNew) {
            const { id, isNew, ...rest } = skill;
            const { data, error } = await supabase.from('skills').insert({ ...rest, updated_at: new Date().toISOString() }).select().single();
            if (error) return showStatus(`Error: ${error.message}`, 'error');
            setSkills((prev) => prev.map((s) => (s.id === id ? data : s)));
            showStatus('Skill category created.');
        } else {
            const { isNew, ...rest } = skill;
            const { error } = await supabase.from('skills').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', skill.id);
            if (error) return showStatus(`Error: ${error.message}`, 'error');
            showStatus('Skill saved.');
        }
    };

    const deleteSkill = async (id, isNew) => {
        if (!isNew) {
            const { error } = await supabase.from('skills').delete().eq('id', id);
            if (error) return showStatus(`Error: ${error.message}`, 'error');
        }
        setSkills((prev) => prev.filter((s) => s.id !== id));
        showStatus('Skill removed.');
    };

    const addSkill = () => {
        setSkills((prev) => [
            ...prev,
            { id: crypto.randomUUID(), category: '', items: '', sort_order: prev.length + 1, isNew: true },
        ]);
    };

    // ---- Contact save ----
    const saveContact = async (contact) => {
        if (contact.isNew) {
            const { id, isNew, ...rest } = contact;
            const { data, error } = await supabase.from('contact').insert({ ...rest, updated_at: new Date().toISOString() }).select().single();
            if (error) return showStatus(`Error: ${error.message}`, 'error');
            setContacts((prev) => prev.map((c) => (c.id === id ? data : c)));
            showStatus('Contact created.');
        } else {
            const { isNew, ...rest } = contact;
            const { error } = await supabase.from('contact').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', contact.id);
            if (error) return showStatus(`Error: ${error.message}`, 'error');
            showStatus('Contact saved.');
        }
    };

    const deleteContact = async (id, isNew) => {
        if (!isNew) {
            const { error } = await supabase.from('contact').delete().eq('id', id);
            if (error) return showStatus(`Error: ${error.message}`, 'error');
        }
        setContacts((prev) => prev.filter((c) => c.id !== id));
        showStatus('Contact removed.');
    };

    const addContact = () => {
        setContacts((prev) => [
            ...prev,
            { id: crypto.randomUUID(), label: '', url: '', display_text: '', sort_order: prev.length + 1, isNew: true },
        ]);
    };

    // ---- Helpers ----
    const updateProject = (id, field, value) => {
        setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    };

    const updateBullet = (projectId, bulletIdx, value) => {
        setProjects((prev) =>
            prev.map((p) => {
                if (p.id !== projectId) return p;
                const bullets = [...p.detail_bullets];
                bullets[bulletIdx] = value;
                return { ...p, detail_bullets: bullets };
            })
        );
    };

    const addBullet = (projectId) => {
        setProjects((prev) =>
            prev.map((p) => (p.id === projectId ? { ...p, detail_bullets: [...p.detail_bullets, ''] } : p))
        );
    };

    const removeBullet = (projectId, bulletIdx) => {
        setProjects((prev) =>
            prev.map((p) => {
                if (p.id !== projectId) return p;
                const bullets = p.detail_bullets.filter((_, i) => i !== bulletIdx);
                return { ...p, detail_bullets: bullets };
            })
        );
    };

    const updateSkill = (id, field, value) => {
        setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
    };

    const updateContact = (id, field, value) => {
        setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    };

    // ---- Render ----
    if (loading) {
        return <div className="admin-loading"><span>Loading...</span></div>;
    }

    if (!session) {
        return <AdminLogin onLogin={() => supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s))} />;
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>// PORTFOLIO CMS</h1>
                <div>
                    <span className="admin-user">{session.user.email}</span>
                    {' '}
                    <button className="btn btn-small btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {status.message && (
                <div className={`status-message ${status.type === 'error' ? 'status-error' : 'status-success'}`}>
                    {status.message}
                </div>
            )}

            {/* ======== PROFILE ======== */}
            <div className="admin-section">
                <h2>▸ Profile (whoami)</h2>
                {profile && (
                    <>
                        <div className="form-group">
                            <label>Name</label>
                            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <input value={profile.status} onChange={(e) => setProfile({ ...profile, status: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Objective</label>
                            <textarea value={profile.objective} onChange={(e) => setProfile({ ...profile, objective: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
                        </div>
                        <button className="btn" onClick={saveProfile}>Save Profile</button>
                    </>
                )}
            </div>

            {/* ======== PROJECTS ======== */}
            <div className="admin-section">
                <h2>▸ Projects</h2>
                {projects.map((project) => (
                    <div key={project.id} className="item-card">
                        <div className="item-card-header">
                            <span>#{project.slug || 'new-project'}</span>
                            <button className="btn btn-small btn-danger" onClick={() => deleteProject(project.id, project.isNew)}>Delete</button>
                        </div>
                        <div className="form-group">
                            <label>Slug</label>
                            <input value={project.slug} onChange={(e) => updateProject(project.id, 'slug', e.target.value)} placeholder="e.g. compiler" />
                        </div>
                        <div className="form-group">
                            <label>Title</label>
                            <input value={project.title} onChange={(e) => updateProject(project.id, 'title', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Short Description</label>
                            <input value={project.short_description} onChange={(e) => updateProject(project.id, 'short_description', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Repo URL</label>
                            <input value={project.repo_url} onChange={(e) => updateProject(project.id, 'repo_url', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Sort Order</label>
                            <input type="number" value={project.sort_order} onChange={(e) => updateProject(project.id, 'sort_order', parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="form-group">
                            <label>Detail Bullets</label>
                            <div className="bullets-list">
                                {project.detail_bullets.map((bullet, idx) => (
                                    <div key={idx} className="bullet-row">
                                        <input value={bullet} onChange={(e) => updateBullet(project.id, idx, e.target.value)} />
                                        <button className="btn btn-small btn-danger" onClick={() => removeBullet(project.id, idx)}>×</button>
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-small btn-cyan" style={{ marginTop: '0.4rem' }} onClick={() => addBullet(project.id)}>+ Bullet</button>
                        </div>
                        <button className="btn" onClick={() => saveProject(project)}>Save Project</button>
                    </div>
                ))}
                <div className="section-actions">
                    <button className="btn btn-cyan" onClick={addProject}>+ Add Project</button>
                </div>
            </div>

            {/* ======== SKILLS ======== */}
            <div className="admin-section">
                <h2>▸ Skills</h2>
                {skills.map((skill) => (
                    <div key={skill.id} className="item-card">
                        <div className="item-card-header">
                            <span>{skill.category || 'NEW CATEGORY'}</span>
                            <button className="btn btn-small btn-danger" onClick={() => deleteSkill(skill.id, skill.isNew)}>Delete</button>
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <input value={skill.category} onChange={(e) => updateSkill(skill.id, 'category', e.target.value)} placeholder="e.g. LANGUAGES" />
                        </div>
                        <div className="form-group">
                            <label>Items (comma-separated)</label>
                            <input value={skill.items} onChange={(e) => updateSkill(skill.id, 'items', e.target.value)} placeholder="C++, Go, Python" />
                        </div>
                        <div className="form-group">
                            <label>Sort Order</label>
                            <input type="number" value={skill.sort_order} onChange={(e) => updateSkill(skill.id, 'sort_order', parseInt(e.target.value) || 0)} />
                        </div>
                        <button className="btn" onClick={() => saveSkill(skill)}>Save Skill</button>
                    </div>
                ))}
                <div className="section-actions">
                    <button className="btn btn-cyan" onClick={addSkill}>+ Add Skill Category</button>
                </div>
            </div>

            {/* ======== CONTACT ======== */}
            <div className="admin-section">
                <h2>▸ Contact</h2>
                {contacts.map((c) => (
                    <div key={c.id} className="item-card">
                        <div className="item-card-header">
                            <span>{c.label || 'NEW CONTACT'}</span>
                            <button className="btn btn-small btn-danger" onClick={() => deleteContact(c.id, c.isNew)}>Delete</button>
                        </div>
                        <div className="form-group">
                            <label>Label</label>
                            <input value={c.label} onChange={(e) => updateContact(c.id, 'label', e.target.value)} placeholder="e.g. Email" />
                        </div>
                        <div className="form-group">
                            <label>URL</label>
                            <input value={c.url} onChange={(e) => updateContact(c.id, 'url', e.target.value)} placeholder="mailto:..." />
                        </div>
                        <div className="form-group">
                            <label>Display Text</label>
                            <input value={c.display_text} onChange={(e) => updateContact(c.id, 'display_text', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Sort Order</label>
                            <input type="number" value={c.sort_order} onChange={(e) => updateContact(c.id, 'sort_order', parseInt(e.target.value) || 0)} />
                        </div>
                        <button className="btn" onClick={() => saveContact(c)}>Save Contact</button>
                    </div>
                ))}
                <div className="section-actions">
                    <button className="btn btn-cyan" onClick={addContact}>+ Add Contact</button>
                </div>
            </div>
        </div>
    );
}

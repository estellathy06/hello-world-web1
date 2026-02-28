import { useState, useRef, useEffect } from 'react';
import { supabase } from './lib/supabase';
import './App.css';

const COMMANDS = {
  'hello world': 'Lists available commands',
  whoami: 'Introduction & goals',
  projects: 'Deep dive into engineering projects',
  skills: 'Technical languages and tools',
  resume: 'Download latest resume (PDF)',
  contact: 'Connect via LinkedIn, GitHub, or Email',
  clear: 'Clears terminal output',
  sysinfo: 'Displays system stats (simulated)',
};

const ASCII_ART = `
     ____.       __             .__               .__        
    |    |__ ___/  |_  ____   __|  |___  __ ______|  |   ____  
    |    |  |  \\   __\\/  _ \\ /     \\  \\/ //  ___/|  | _/ __ \\ 
/\\__|    |  |  /|  | (  <_> )  Y Y  \\   / \\___ \\ |  |_\\  ___/ 
\\________|____/ |__|  \\____/|__|_|__/__/ /____  >|____/\\___  >
                                              \\/           \\/ 
`;

// Fallback data if Supabase fetch fails
const FALLBACK = {
  profile: {
    name: 'Estella Tang',
    status: 'CS Student @ University of Waterloo',
    objective: 'Seeking co-op roles where I can architect robust systems, crush complex bugs, and build products at scale.',
    bio: 'I thrive in high-impact environments. I am building toward a career in backend engineering, distributed systems, and AI.'
  },
  projects: [
    { slug: 'compiler', title: 'C-Minus Compiler', short_description: 'Custom C-like Compiler (C++, LLVM)', detail_bullets: ['Developed a custom compiler in C++ using LLVM.', 'Features: Lexical analysis, recursive descent parsing, semantic analysis, and optimized x86 code generation.'], repo_url: '#', sort_order: 1 },
    { slug: 'distributed-kv', title: 'DistKV (Go)', short_description: 'Distributed Database (Go, Raft)', detail_bullets: ['Built a distributed key-value store implementing Raft consensus.', 'Features: Fault tolerance, leader election, log replication, snapshotting for fast recovery.'], repo_url: '#', sort_order: 2 },
    { slug: 'neural-net', title: 'Zero-Dep Neural Network (Python)', short_description: 'Scratch Neural Network (Python, Math)', detail_bullets: ['Implemented backpropagation and gradient descent purely with NumPy.', 'Achieved 96% accuracy on MNIST. Heavily optimized matrix multiplications.'], repo_url: '#', sort_order: 3 },
  ],
  skills: [
    { category: 'LANGUAGES', items: 'C++, Go, Python, JavaScript, TypeScript, SQL, Bash' },
    { category: 'FRAMEWORKS', items: 'React, Node.js, Express, Flask' },
    { category: 'TOOLS/DEVOPS', items: 'Git, Docker, Linux, AWS, LLVM' },
    { category: 'THEORY', items: 'Algorithms, Distributed Systems, Compilers, OS' },
  ],
  contacts: [
    { label: 'Email', url: 'mailto:estella.thy06@gmail.com', display_text: 'estella.thy06@gmail.com' },
    { label: 'GitHub', url: 'https://github.com/estellathy06', display_text: 'github.com/estellathy06' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/estella-tang-9a2173299/', display_text: 'linkedin.com/in/estella-tang-9a2173299/' },
  ],
};

function App() {
  const [history, setHistory] = useState([
    {
      id: 0,
      command: '',
      output: (
        <div className="output-multi">
          <div className="ascii-art">{ASCII_ART}</div>
          <p>Welcome to the UWaterloo CS Co-op Interactive Portfolio Terminal.</p>
          <p>Initializing system components...</p>
          <p className="text-cyan">Type <span className="text-yellow">hello world</span> to see available commands.</p>
        </div>
      )
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(true);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Dynamic content state
  const [profileData, setProfileData] = useState(FALLBACK.profile);
  const [projectsData, setProjectsData] = useState(FALLBACK.projects);
  const [skillsData, setSkillsData] = useState(FALLBACK.skills);
  const [contactsData, setContactsData] = useState(FALLBACK.contacts);

  // Fetch content from Supabase on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [profileRes, projectsRes, skillsRes, contactRes] = await Promise.all([
          supabase.from('profile').select('*').limit(1).single(),
          supabase.from('projects').select('*').order('sort_order'),
          supabase.from('skills').select('*').order('sort_order'),
          supabase.from('contact').select('*').order('sort_order'),
        ]);

        if (profileRes.data) setProfileData(profileRes.data);
        if (projectsRes.data) setProjectsData(projectsRes.data);
        if (skillsRes.data) setSkillsData(skillsRes.data);
        if (contactRes.data) setContactsData(contactRes.data);
      } catch (err) {
        console.warn('Failed to fetch from Supabase, using fallback data:', err);
      }
    };

    fetchContent();
  }, []);

  // Auto-focus input on mount and clicks
  useEffect(() => {
    inputRef.current?.focus();
    const handleGlobalClick = () => inputRef.current?.focus();
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Auto-scroll to bottom on new history
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const processCommand = (cmd) => {
    const trimmed = cmd.trim();
    const args = trimmed.split(' ');
    const mainCmd = args[0].toLowerCase();

    let output;

    if (trimmed.toLowerCase() === 'hello world') {
      output = (
        <div className="output-multi">
          {Object.entries(COMMANDS).map(([k, v]) => (
            <p key={k}>
              <span className="text-yellow" style={{ display: 'inline-block', width: '130px' }}>{k}</span>
              <span className="text-secondary">- {v}</span>
            </p>
          ))}
        </div>
      );
    } else {
      switch (mainCmd) {
        case 'whoami':
          output = (
            <div className="output-multi">
              <p className="text-cyan">=========================================</p>
              <p className="text-magenta font-bold">IDENTITY: {profileData.name}</p>
              <p className="text-white">STATUS: {profileData.status}</p>
              <p>OBJECTIVE: {profileData.objective}</p>
              <p>{profileData.bio}</p>
              <p className="text-cyan">=========================================</p>
            </div>
          );
          break;

        case 'projects':
          if (args[1] === '--detail') {
            const targetSlug = args[2];
            const project = targetSlug ? projectsData.find((p) => p.slug === targetSlug) : null;

            if (project) {
              output = (
                <div className="output-multi">
                  <p className="text-cyan">Project: {project.title}</p>
                  {project.detail_bullets.map((bullet, i) => (
                    <p key={i}>- {bullet}</p>
                  ))}
                  <p><a href={project.repo_url} className="terminal-link" target="_blank" rel="noopener noreferrer">View Repo</a></p>
                </div>
              );
            } else {
              output = (
                <div className="output-multi">
                  <p className="text-red">Error: Expected project ID. Usage: projects --detail [name]</p>
                  <p className="text-secondary">Available details: <span className="text-white">{projectsData.map((p) => p.slug).join(', ')}</span></p>
                </div>
              );
            }
          } else {
            output = (
              <div className="output-multi">
                {projectsData.map((project, i) => (
                  <p key={project.slug}>
                    {i + 1}. <span className="text-yellow">{project.slug}</span> - {project.short_description}
                  </p>
                ))}
                <br />
                <p className="text-secondary">Type <span className="text-white">projects --detail [name]</span> for engineering notes.</p>
              </div>
            );
          }
          break;

        case 'skills':
          output = (
            <div className="output-multi">
              {skillsData.map((skill) => (
                <p key={skill.category}>
                  <span className="text-blue">{skill.category}:</span> {skill.items}
                </p>
              ))}
            </div>
          );
          break;

        case 'resume':
          output = (
            <div className="output-multi">
              <p className="text-yellow">Generating secure link...</p>
              <p><a href="/hello-world-web1/Estella_Tang_Resume.pdf" target="_blank" className="terminal-link">Click here to view/download PDF</a></p>
            </div>
          );
          break;

        case 'contact':
          output = (
            <div className="output-multi">
              {contactsData.map((c) => (
                <p key={c.label}>
                  <span className="text-magenta">{c.label}:</span>{'     '.substring(0, Math.max(1, 10 - c.label.length))}
                  <a href={c.url} className="terminal-link">{c.display_text}</a>
                </p>
              ))}
            </div>
          );
          break;

        case 'sysinfo':
          output = (
            <div className="output-multi text-secondary">
              <p>OS: uwaterloo-arch 5.15.0-generic</p>
              <p>Kernel: x86_64 Linux</p>
              <p>Uptime: 2 days, 14 hours, 3 mins</p>
              <p>Shell: custom-bash-react</p>
              <p>Memory: 8192MiB / 16384MiB</p>
            </div>
          )
          break;

        case 'clear':
          setHistory([]);
          return;

        case '':
          output = null;
          break;

        default: {
          const funnyErrors = [
            `bash: ${trimmed}: command not found. Have you tried asking nicely?`,
            `zsh: command not found: ${trimmed}. My developer didn't build that.`,
            `[ERROR] ${trimmed} is invalid. Did you mean 'hello world'?`,
            `System Exception: Segment Fault... just kidding. Type 'hello world'.`,
            `${trimmed}? Never heard of it. Try 'hello world'.`,
            `Are you trying to hack me? 🛡️ Access denied to '${trimmed}'.`,
            `404: The command '${trimmed}' does not exist in this dimension.`,
            `I'm sorry Dave, I'm afraid I can't do '${trimmed}'.`
          ];
          const randomError = funnyErrors[Math.floor(Math.random() * funnyErrors.length)];
          output = <p className="text-red">{randomError}</p>;
        }
      }
    }

    setHistory(prev => [...prev, {
      id: Date.now(),
      command: trimmed,
      output
    }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      processCommand(inputVal);
      setInputVal('');
      setCmdIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const cmds = history.filter(h => h.command !== '');
      if (cmds.length > 0) {
        const nextIdx = cmdIndex === -1 ? cmds.length - 1 : Math.max(0, cmdIndex - 1);
        setCmdIndex(nextIdx);
        setInputVal(cmds[nextIdx].command);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const cmds = history.filter(h => h.command !== '');
      if (cmdIndex !== -1) {
        if (cmdIndex === cmds.length - 1) {
          setCmdIndex(-1);
          setInputVal('');
        } else {
          setCmdIndex(cmdIndex + 1);
          setInputVal(cmds[cmdIndex + 1].command);
        }
      }
    }
  };

  return (
    <div className="terminal" ref={scrollRef}>
      <div className="history">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            {item.command !== '' && (
              <div className="command-line">
                <span className="prompt">guest@uwaterloo:~$</span>
                <span className="command-text">{item.command}</span>
              </div>
            )}
            {item.output && <div className="output">{item.output}</div>}
          </div>
        ))}
      </div>

      <div className="input-line">
        <span className="prompt">guest@uwaterloo:~$</span>
        <div style={{ position: 'relative', flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <span className="command-text" style={{ whiteSpace: 'pre' }}>{inputVal}</span>
          <span className={`cursor ${isFocused ? 'active' : 'inactive'}`}></span>
          <input
            ref={inputRef}
            type="text"
            className="input-field"
            style={{ position: 'absolute', opacity: 0, top: 0, left: 0, width: '100%', height: '100%' }}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}

export default App;

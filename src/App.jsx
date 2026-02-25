import { useState, useRef, useEffect } from 'react';
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
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

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
              <p className="text-magenta font-bold">IDENTITY: Estella Tang</p>
              <p className="text-white">STATUS: CS Student @ University of Waterloo</p>
              <p>OBJECTIVE: Seeking co-op roles where I can architect robust systems, crush complex bugs, and build products at scale.</p>
              <p>I thrive in high-impact environments. I am building toward a career in backend engineering, distributed systems, and AI.</p>
              <p className="text-cyan">=========================================</p>
            </div>
          );
          break;

        case 'projects':
          if (args[1] === '--detail') {
            output = (
              <div className="output-multi">
                <p className="text-red">Error: Expected project ID. Usage: projects --detail [name]</p>
                <p className="text-secondary">Available details: <span className="text-white">compiler, distributed-kv, neural-net</span></p>
              </div>
            );
            if (args[2] === 'compiler') {
              output = (
                <div className="output-multi">
                  <p className="text-cyan">Project: C-Minus Compiler</p>
                  <p>- Developed a custom compiler in C++ using LLVM.</p>
                  <p>- Features: Lexical analysis, recursive descent parsing, semantic analysis, and optimized x86 code generation.</p>
                  <p>- <a href="#" className="terminal-link">View Repo</a></p>
                </div>
              );
            } else if (args[2] === 'distributed-kv') {
              output = (
                <div className="output-multi">
                  <p className="text-cyan">Project: DistKV (Go)</p>
                  <p>- Built a distributed key-value store implementing Raft consensus.</p>
                  <p>- Features: Fault tolerance, leader election, log replication, snapshotting for fast recovery.</p>
                  <p>- <a href="#" className="terminal-link">View Repo</a></p>
                </div>
              );
            } else if (args[2] === 'neural-net') {
              output = (
                <div className="output-multi">
                  <p className="text-cyan">Project: Zero-Dep Neural Network (Python)</p>
                  <p>- Implemented backpropagation and gradient descent purely with NumPy.</p>
                  <p>- Achieved 96% accuracy on MNIST. Heavily optimized matrix multiplications.</p>
                  <p>- <a href="#" className="terminal-link">View Repo</a></p>
                </div>
              );
            }
          } else {
            output = (
              <div className="output-multi">
                <p>1. <span className="text-yellow">compiler</span> - Custom C-like Compiler (C++, LLVM)</p>
                <p>2. <span className="text-yellow">distributed-kv</span> - Distributed Database (Go, Raft)</p>
                <p>3. <span className="text-yellow">neural-net</span> - Scratch Neural Network (Python, Math)</p>
                <br />
                <p className="text-secondary">Type <span className="text-white">projects --detail [name]</span> for engineering notes.</p>
              </div>
            );
          }
          break;

        case 'skills':
          output = (
            <div className="output-multi">
              <p><span className="text-blue">LANGUAGES:</span> C++, Go, Python, JavaScript, TypeScript, SQL, Bash</p>
              <p><span className="text-blue">FRAMEWORKS:</span> React, Node.js, Express, Flask</p>
              <p><span className="text-blue">TOOLS/DEVOPS:</span> Git, Docker, Linux, AWS, LLVM</p>
              <p><span className="text-blue">THEORY:</span> Algorithms, Distributed Systems, Compilers, OS</p>
            </div>
          );
          break;

        case 'resume':
          output = (
            <div className="output-multi">
              <p className="text-yellow">Generating secure link...</p>
              <p><a href="/Estella_Tang_Resume.pdf" target="_blank" className="terminal-link">Click here to view/download PDF</a></p>
            </div>
          );
          break;

        case 'contact':
          output = (
            <div className="output-multi">
              <p><span className="text-magenta">Email:</span>     <a href="mailto:example@uwaterloo.ca" className="terminal-link">example@uwaterloo.ca</a></p>
              <p><span className="text-magenta">GitHub:</span>    <a href="https://github.com/estella" className="terminal-link">github.com/estella</a></p>
              <p><span className="text-magenta">LinkedIn:</span>  <a href="https://linkedin.com/in/estellatang" className="terminal-link">linkedin.com/in/estellatang</a></p>
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

        default:
          output = <p className="text-red">Command not found: {trimmed}. Type 'hello world' for available commands.</p>;
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
          <span className="cursor"></span>
          <input
            ref={inputRef}
            type="text"
            className="input-field"
            style={{ position: 'absolute', opacity: 0, top: 0, left: 0, width: '100%', height: '100%' }}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}

export default App;

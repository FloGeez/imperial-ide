import { FileSystemTree } from "@webcontainer/api";

export const files: FileSystemTree = {
  "package.json": {
    file: {
      contents: JSON.stringify(
        {
          name: "star-wars-app",
          type: "module",
          scripts: {
            start:
              'concurrently "npm run start:server" "wait-on tcp:3000 && npm run start:client"',
            "start:server": "nodemon --watch server server/index.js",
            "start:client": "vite client",
          },
          dependencies: {
            express: "^4.18.2",
            cors: "^2.8.5",
            concurrently: "^8.0.1",
            "wait-on": "^7.0.1",
            nodemon: "^3.0.1",
          },
          devDependencies: {
            vite: "^4.0.0",
          },
        },
        null,
        2
      ),
    },
  },

  server: {
    directory: {
      "index.js": {
        file: {
          contents: `import express from 'express';
import cors from 'cors';

const app = express();

// Activation de CORS
app.use(cors());

const characters = [
  { id: 1, name: 'Luke Skywalker', role: 'Jedi Knight' },
  { id: 2, name: 'Darth Vader', role: 'Sith Lord' },
  { id: 3, name: 'Yoda', role: 'Jedi Master' },
  { id: 4, name: 'Obi-Wan Kenobi', role: 'Jedi Master' }
];

app.get('/api/characters', (req, res) => {
  res.json(characters);
});

app.get('/', (req, res) => {
  res.send(\`
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          background: #000 ;
          color: #FFE81F;
          font-family: 'Arial', sans-serif;
          margin: 0;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        h1 {
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 1rem 0;
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          text-shadow: 0 0 10px rgba(255, 232, 31, 0.5);
        }

        p {
          text-align: center;
          margin-bottom: 1rem;
          color: #fff;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
        }

        li {
          margin: 1rem 0;
          text-align: center;
        }

        a {
          color: #FFE81F;
          text-decoration: none;
          padding: 0.8rem 1.5rem;
          border: 1px solid #FFE81F;
          border-radius: 4px;
          transition: all 0.3s ease;
          display: inline-block;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
        }

        a:hover {
          background: rgba(255, 232, 31, 0.1);
          box-shadow: 0 0 15px rgba(255, 232, 31, 0.3);
          transform: translateY(-2px);
        }

        .ascii-art {
          font-family: monospace;
          white-space: pre;
          text-align: center;
          color: #FFE81F;
          margin: 1.5rem 0;
          font-size: clamp(0.4rem, 1.5vw, 0.8rem);
          opacity: 0.7;
          line-height: 1.2;
        }

        @media (min-width: 768px) {
          .ascii-art {
            font-size: 0.7rem;
            margin: 2rem 0;
          }
          
          .container {
            padding: 3rem;
          }
        }

        @media (max-width: 480px) {
          body {
            padding: 10px;
          }
          
          .container {
            padding: 1.5rem;
          }
        }
      </style>
      <title>Star Wars API</title>
    </head>
    <body>
      <div class="container">
        <div class="ascii-art">
    .    .        .      .             . .     .        .          .          .
         .                 .                    .                .
  .               A long time ago in a galaxy far,         .
     .               .    far away...     .               .        .             .
           .               .            .                         .
                                               .                     .
     .          ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄        .             .
            .  ████████████████████  .        .                  .
  .             ▀██████████████▀                                       .
         .         ▀██████▀           .                      .
                     ▀██▀                         .                 .
        </div>
        <h1>Star Wars API</h1>
        <p>Bienvenue dans l'API Star Wars. Que la Force soit avec vous !</p>
        <p>Endpoints disponibles :</p>
        <ul>
          <li><a href="/api/characters">/api/characters</a></li>
        </ul>
      </div>
    </body>
    </html>
  \`);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(\`May the Force be with you at http://localhost:\${PORT}\`);
});`,
        },
      },
    },
  },

  client: {
    directory: {
      "index.html": {
        file: {
          contents: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Star Wars Characters</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <div class="title-container">
        <div class="intro">
.    .        .      .             . .     .        .          .
     .                 .                    .                .
.               The Force is strong         .
 .               .    with these ones    .        .             .
       .               .            .                         .
 .          ▄▄▄▄▄▄▄▄▄▄        .             .
        .  ████████████  .        .                  .
.             ▀████████▀                                    .
     .         ▀██▀           .                      .
        </div>
        <h1>Star Wars Characters</h1>
    </div>
    <div class="characters" id="characters-container">
        <div class="loading">Searching the galaxy for characters...</div>
    </div>
    <script type="module" src="/main.js"></script>
</body>
</html>`,
        },
      },
      "styles.css": {
        file: {
          contents: `body {
    background: #000;
    color: #FFE81F;
    font-family: 'Arial', sans-serif;
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.title-container {
    text-align: center;
    margin-bottom: 2rem;
    margin: 1rem;
}

.intro {
    font-family: monospace;
    white-space: pre;
    text-align: center;
    color: #FFE81F;
    margin: 1rem 0;
    font-size: clamp(0.4rem, 1.5vw, 0.8rem);
    opacity: 0.7;
    line-height: 1.2;
}

h1 {
    text-align: center;
    color: #FFE81F;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    text-shadow: 0 0 10px rgba(255, 232, 31, 0.5);
    margin: 1rem 0;
    position: relative;
    display: inline-block;
    padding: 0 1rem;
}

h1::before, h1::after {
    content: '';
    position: absolute;
    top: 50%;
    width: min(100px, 15vw);
    height: 1px;
    background: linear-gradient(to var(--direction, right), #FFE81F, transparent);
}

h1::before {
    right: 100%;
    --direction: right;
}

h1::after {
    left: 100%;
    --direction: left;
}

.loading {
    text-align: center;
    padding: 2rem;
    font-size: clamp(1rem, 2vw, 1.2rem);
    color: #FFE81F;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.characters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
    gap: 1rem;
    padding: 1rem;
}

.character-card {
    background: rgba(255, 232, 31, 0.05);
    border: 1px solid #FFE81F;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.character-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #FFE81F, transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
}

.character-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 232, 31, 0.2);
    background: rgba(255, 232, 31, 0.1);
}

.character-card:hover::before {
    transform: translateX(100%);
}

.character-card h2 {
    margin: 0 0 0.5rem 0;
    color: #FFE81F;
    font-size: clamp(1.3rem, 1.5vw, 1.5rem);
}

.character-card p {
    margin: 0;
    color: #fff;
    font-size: clamp(0.9rem, 1.5vw, 1rem);
    opacity: 0.8;
}

.error {
    color: #FF4444;
    text-align: center;
    padding: 2rem;
    border: 2px solid #FF4444;
    border-radius: 8px;
    margin: 2rem auto;
    background: rgba(255, 68, 68, 0.1);
    font-size: clamp(0.9rem, 1.5vw, 1rem);
}`,
        },
      },
      "main.js": {
        file: {
          contents: `async function loadCharacters() {
    try {
        const response = await fetch('http://localhost:3000/api/characters');
        const characters = await response.json();
        const container = document.getElementById('characters-container');
        container.innerHTML = characters.map(char => {
            return \`
                <div class="character-card">
                    <h2>\${char.name}</h2>
                    <p>\${char.role}</p>
                </div>
            \`;
        }).join('');
    } catch (error) {
        console.error('Error loading characters:', error);
        document.getElementById('characters-container').innerHTML = \`
            <div class="error">
                Failed to load characters. The dark side is strong...
            </div>
        \`;
    }
}

loadCharacters();`,
        },
      },
      "vite.config.js": {
        file: {
          contents: `export default {
      server: {
        port: 5173,
        host: true
      }
    }`,
        },
      },
    },
  },
};

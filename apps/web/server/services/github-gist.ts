/**
 * GitHub Gist Service
 * Handles creating, reading, updating, and deleting GitHub Gists
 * for storing large code snippets (>= 5KB)
 */

const GITHUB_API_BASE = 'https://api.github.com';
const GIST_SIZE_THRESHOLD = 5 * 1024; // 5KB in bytes

interface GistResponse {
  id: string;
  html_url: string;
  description?: string;
  files: Record<string, { content: string }>;
}

/**
 * Get GitHub token from environment
 */
function getGitHubToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is not set');
  }
  return token;
}

/**
 * Create a new GitHub Gist
 * @param code - The code content to store
 * @param title - Title for the gist
 * @param language - Programming language (for file extension)
 * @returns Gist ID and URL
 */
export async function createGist(
  code: string,
  title: string,
  language: string = 'rust'
): Promise<{ id: string; url: string }> {
  const token = getGitHubToken();
  
  // Determine file extension based on language
  const fileExtension = getFileExtension(language);
  const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExtension}`;
  
  const response = await fetch(`${GITHUB_API_BASE}/gists`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: `Solana Playground: ${title}`,
      public: false, // Unlisted (not searchable)
      files: {
        [filename]: {
          content: code,
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create Gist: ${response.status} ${error}`);
  }

  const gist: GistResponse = await response.json();
  return {
    id: gist.id,
    url: gist.html_url,
  };
}

/**
 * Get code content from a GitHub Gist
 * @param gistId - The Gist ID
 * @returns The code content
 */
export async function getGistContent(gistId: string): Promise<string> {
  const token = getGitHubToken();
  
  const response = await fetch(`${GITHUB_API_BASE}/gists/${gistId}`, {
    method: 'GET',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Gist not found: ${gistId}`);
    }
    const error = await response.text();
    throw new Error(`Failed to fetch Gist: ${response.status} ${error}`);
  }

  const gist: GistResponse = await response.json();
  
  // Get the first file's content
  const files = Object.values(gist.files);
  if (files.length === 0) {
    throw new Error(`Gist ${gistId} has no files`);
  }
  
  const firstFile = files[0];
  if (!firstFile) {
    throw new Error(`Gist ${gistId} has no valid files`);
  }
  
  return firstFile.content;
}

/**
 * Update an existing GitHub Gist
 * @param gistId - The Gist ID
 * @param code - The new code content
 * @param title - Title for the gist (optional, for filename)
 * @param language - Programming language (optional)
 */
export async function updateGist(
  gistId: string,
  code: string,
  title?: string,
  language: string = 'rust'
): Promise<void> {
  const token = getGitHubToken();
  
  // First, get the existing gist to find the filename
  const existingGist = await fetch(`${GITHUB_API_BASE}/gists/${gistId}`, {
    method: 'GET',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!existingGist.ok) {
    throw new Error(`Failed to fetch existing Gist: ${existingGist.status}`);
  }

  const gist: GistResponse = await existingGist.json();
  const existingFilename = Object.keys(gist.files)[0];
  
  if (!existingFilename) {
    throw new Error(`Gist ${gistId} has no files`);
  }
  
  // Determine new filename if title provided
  const filename = title 
    ? `${title.replace(/[^a-zA-Z0-9]/g, '_')}.${getFileExtension(language)}`
    : existingFilename;

  // Build files object
  const filesUpdate: Record<string, { content: string } | null> = {};
  if (filename !== existingFilename) {
    // Renaming: delete old file and create new one
    filesUpdate[existingFilename] = null;
    filesUpdate[filename] = { content: code };
  } else {
    // Same filename: just update content
    filesUpdate[existingFilename] = { content: code };
  }

  const response = await fetch(`${GITHUB_API_BASE}/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: title ? `Solana Playground: ${title}` : gist.description || '',
      files: filesUpdate,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update Gist: ${response.status} ${error}`);
  }
}

/**
 * Delete a GitHub Gist
 * @param gistId - The Gist ID
 */
export async function deleteGist(gistId: string): Promise<void> {
  const token = getGitHubToken();
  
  const response = await fetch(`${GITHUB_API_BASE}/gists/${gistId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok && response.status !== 404) {
    // 404 is okay (already deleted)
    const error = await response.text();
    throw new Error(`Failed to delete Gist: ${response.status} ${error}`);
  }
}

/**
 * Check if code should be stored in Gist based on size
 * @param code - The code content
 * @returns true if code should be stored in Gist
 */
export function shouldUseGist(code: string): boolean {
  // Calculate size in bytes (UTF-8 encoding)
  // Each character is typically 1 byte for ASCII, but can be more for UTF-8
  // Using Buffer for accurate byte count in Node.js
  const sizeInBytes = Buffer.byteLength(code, 'utf8');
  return sizeInBytes >= GIST_SIZE_THRESHOLD;
}

/**
 * Get file extension based on language
 */
function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    rust: 'rs',
    typescript: 'ts',
    javascript: 'js',
    python: 'py',
    go: 'go',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
  };
  
  return extensions[language.toLowerCase()] || 'txt';
}


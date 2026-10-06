import { profile, promptHost, promptUser } from '@/data/profile'

export default function Footer() {
  return (
    <footer className="px-5 py-12 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-mono text-xs">
            <p>
              <span className="text-phos">{promptUser}@{promptHost}</span>
              <span className="text-dim">:~$</span>
              <span className="text-fg"> whoami</span>
            </p>
            <p className="mt-1.5 text-dim">
              {profile.name} — {profile.role}, {profile.location}
            </p>
          </div>

          <div className="text-2xs text-dim">
            <p>
              Built with React, TypeScript, Vite and Tailwind. No audio files — the lo-fi is
              synthesised.
            </p>
            <p className="mt-1.5">
              Deployed to GitHub Pages by GitHub Actions. © {new Date().getFullYear()}{' '}
              {profile.name}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

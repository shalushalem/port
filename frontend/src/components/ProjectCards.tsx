'use client'
import { motion } from 'framer-motion'

export interface ProjectCardData {
  id: string
  title: string
  description: string
  tags: string[]
  year: string
  status: 'Live' | 'Beta' | 'Building'
}

interface ProjectCardsProps {
  projects: ProjectCardData[]
  visible: boolean
}

const STATUS_TONE: Record<ProjectCardData['status'], string> = {
  Live: 'text-cyan-200 border-cyan-300/30 bg-cyan-500/15',
  Beta: 'text-blue-200 border-blue-300/30 bg-blue-500/15',
  Building: 'text-violet-200 border-violet-300/30 bg-violet-500/15',
}

export default function ProjectCards({ projects, visible }: ProjectCardsProps) {
  if (!visible) return null

  return (
    <motion.section
      className="relative z-30 mx-auto mt-2 w-[min(1100px,95vw)]"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.8 }}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-[10px] uppercase tracking-[0.32em] text-blue-200/35">Project Signals</p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/35">Live Knowledge Nodes</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {projects.map((project, index) => (
          <motion.article
            key={project.id}
            className="glass rounded-2xl border border-blue-300/18 p-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + index * 0.08, duration: 0.55 }}
            whileHover={{ y: -4, scale: 1.01 }}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold tracking-wide text-slate-100">{project.title}</h3>
              <span
                className={`rounded-full border px-2 py-[2px] text-[9px] uppercase tracking-[0.16em] ${STATUS_TONE[project.status]}`}
              >
                {project.status}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-blue-100/63">{project.description}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-blue-300/18 bg-blue-500/10 px-2 py-[2px] text-[9px] uppercase tracking-[0.14em] text-blue-100/65"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-blue-200/30">{project.year}</p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  )
}

export default function Projects() {
  const projects = [
    {
      title: 'Wordle Game',
      description: 'Play the classic word game right in your browser',
      tech: 'React, Next.js',
      href: '/wordle'
    },
    {
      title: 'SQL + Airbnb Data Analysis',
      description: 'Analyzing Airbnb listing data with SQL queries',
      tech: 'SQL, Python',
      href: '#'
    },
    { 
      title: 'Wordle Python Game', 
      description: 'Recreation of the popular word game',
      tech: 'Python',
      href: '#'
    },
    { 
      title: 'Programmatic Advertising', 
      description: 'Research on digital ad tech ecosystem',
      tech: 'Research',
      href: '#'
    },
    { 
      title: 'Scratch Programming', 
      description: 'Visual programming project',
      tech: 'Scratch',
      href: '#'
    },
  ]

  return (
    <section id="projects" className="bg-white py-16 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Projects
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map(project => (
            <a 
              key={project.title}
              href={project.href}
              className="block border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {project.description}
              </p>
              <span className="text-xs text-gray-400">
                {project.tech}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

import React, { useState, useEffect } from 'react';

interface Project {
  title: string;
  chapters: Chapter[];
}

interface Chapter {
  title: string;
  scenes: Scene[];
}

interface Scene {
  title: string;
  content: string;
}

const initialProject: Project = {
  title: 'New Project',
  chapters: [
    {
      title: 'Chapter 1',
      scenes: [
        { title: 'Scene 1', content: '' },
        { title: 'Scene 2', content: '' },
      ],
    },
  ],
};

const Scrivener = () => {
  const [project, setProject] = useState(initialProject);
  const [activeChapter, setActiveChapter] = useState(project.chapters[0]);
  const [activeScene, setActiveScene] = useState(activeChapter.scenes[0]);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isBinderOpen, setIsBinderOpen] = useState(true);

  useEffect(() => {
    const storedProject = localStorage.getItem('project');
    if (storedProject) {
      setProject(JSON.parse(storedProject));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('project', JSON.stringify(project));
  }, [project]);

  const handleChapterChange = (chapter: Chapter) => {
    setActiveChapter(chapter);
    setActiveScene(chapter.scenes[0]);
  };

  const handleSceneChange = (scene: Scene) => {
    setActiveScene(scene);
  };

  const handleSceneContentChange = (content: string) => {
    setActiveScene({ ...activeScene, content });
    setProject({
      ...project,
      chapters: project.chapters.map((chapter) =>
        chapter.title === activeChapter.title
          ? {
              ...chapter,
              scenes: chapter.scenes.map((scene) =>
                scene.title === activeScene.title ? { ...scene, content } : scene
              ),
            }
          : chapter
      ),
    });
  };

  const handleAddScene = () => {
    const newScene: Scene = { title: `Scene ${activeChapter.scenes.length + 1}`, content: '' };
    setProject({
      ...project,
      chapters: project.chapters.map((chapter) =>
        chapter.title === activeChapter.title
          ? { ...chapter, scenes: [...chapter.scenes, newScene] }
          : chapter
      ),
    });
    setActiveScene(newScene);
  };

  const handleDeleteScene = () => {
    setProject({
      ...project,
      chapters: project.chapters.map((chapter) =>
        chapter.title === activeChapter.title
          ? {
              ...chapter,
              scenes: chapter.scenes.filter((scene) => scene.title !== activeScene.title),
            }
          : chapter
      ),
    });
    setActiveScene(activeChapter.scenes[0]);
  };

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      title: `Chapter ${project.chapters.length + 1}`,
      scenes: [{ title: 'Scene 1', content: '' }],
    };
    setProject({ ...project, chapters: [...project.chapters, newChapter] });
    setActiveChapter(newChapter);
    setActiveScene(newChapter.scenes[0]);
  };

  const handleDeleteChapter = () => {
    setProject({
      ...project,
      chapters: project.chapters.filter((chapter) => chapter.title !== activeChapter.title),
    });
    setActiveChapter(project.chapters[0]);
    setActiveScene(project.chapters[0].scenes[0]);
  };

  const handleInspectorToggle = () => {
    setIsInspectorOpen(!isInspectorOpen);
  };

  const handleBinderToggle = () => {
    setIsBinderOpen(!isBinderOpen);
  };

  return (
    <div className="flex h-screen">
      {isBinderOpen && (
        <div className="w-64 bg-gray-100 p-4">
          <h2 className="text-lg font-bold mb-2">{project.title}</h2>
          <ul>
            {project.chapters.map((chapter) => (
              <li
                key={chapter.title}
                className={`p-2 cursor-pointer ${
                  activeChapter.title === chapter.title ? 'bg-blue-100' : ''
                }`}
                onClick={() => handleChapterChange(chapter)}
              >
                {chapter.title}
              </li>
            ))}
          </ul>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddChapter}
          >
            Add Chapter
          </button>
        </div>
      )}
      <div className="flex-1 p-4">
        <h2 className="text-lg font-bold mb-2">{activeChapter.title}</h2>
        <ul>
          {activeChapter.scenes.map((scene) => (
            <li
              key={scene.title}
              className={`p-2 cursor-pointer ${
                activeScene.title === scene.title ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleSceneChange(scene)}
            >
              {scene.title}
            </li>
          ))}
        </ul>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddScene}
        >
          Add Scene
        </button>
        <h2 className="text-lg font-bold mb-2">{activeScene.title}</h2>
        <textarea
          className="w-full h-full p-2"
          value={activeScene.content}
          onChange={(e) => handleSceneContentChange(e.target.value)}
        />
      </div>
      {isInspectorOpen && (
        <div className="w-64 bg-gray-100 p-4">
          <h2 className="text-lg font-bold mb-2">Inspector</h2>
          <p>Chapter: {activeChapter.title}</p>
          <p>Scene: {activeScene.title}</p>
          <p>Word Count: {activeScene.content.split(' ').length}</p>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleDeleteScene}
          >
            Delete Scene
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleDeleteChapter}
          >
            Delete Chapter
          </button>
        </div>
      )}
      <button
        className="absolute top-0 right-0 bg-gray-100 p-2"
        onClick={handleBinderToggle}
      >
        {isBinderOpen ? 'Hide Binder' : 'Show Binder'}
      </button>
      <button
        className="absolute top-0 right-10 bg-gray-100 p-2"
        onClick={handleInspectorToggle}
      >
        {isInspectorOpen ? 'Hide Inspector' : 'Show Inspector'}
      </button>
    </div>
  );
};

export default Scrivener;
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import roadmapData from '../data/roadmapData';
import { getProgress, toggleTask } from '../api/roadmapApi';
import './Roadmap.css';

function Roadmap() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(roadmapData[0]?.week || null);

  const fetchProgress = async () => {
    try {
      const res = await getProgress();
      setCompletedTasks(res.data.completedTasks);
    } catch (err) {
      setCompletedTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleToggle = async (taskId) => {
    const wasCompleted = completedTasks.includes(taskId);
    setCompletedTasks((prev) =>
      wasCompleted ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );

    try {
      await toggleTask(taskId);
    } catch (err) {
      setCompletedTasks((prev) =>
        wasCompleted ? [...prev, taskId] : prev.filter((id) => id !== taskId)
      );
    }
  };

  const totalTasks = roadmapData.reduce((sum, week) => sum + week.tasks.length, 0);
  const completedCount = completedTasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const currentWeek = roadmapData.find((w) => w.week === selectedWeek);

  if (loading) return <p className="status-text">Loading roadmap...</p>;

  return (
    <div className="roadmap-page">
      <h2 className="roadmap-title">Placement Roadmap</h2>

      <div className="roadmap-progress-bar">
        <div className="roadmap-progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>
      <p className="roadmap-progress-text">
        {completedCount} / {totalTasks} tasks completed ({progressPercent}%)
      </p>

      <div className="week-tabs">
        {roadmapData.map((week) => {
          const weekDone = week.tasks.every((t) => completedTasks.includes(t.id));
          return (
            <button
              key={week.week}
              className={
                selectedWeek === week.week
                  ? weekDone
                    ? 'week-tab active done'
                    : 'week-tab active'
                  : weekDone
                  ? 'week-tab done'
                  : 'week-tab'
              }
              onClick={() => setSelectedWeek(week.week)}
            >
              {week.week}
            </button>
          );
        })}
      </div>

      {currentWeek && (
        <div className="roadmap-week">
          <h3>
            {currentWeek.week} <span className="week-focus">— {currentWeek.focus}</span>
          </h3>
          <ul className="task-list">
            {currentWeek.tasks.map((task) => {
              const isDone = completedTasks.includes(task.id);
              return (
                <li
                  key={task.id}
                  className={isDone ? 'task-item done' : 'task-item'}
                  onClick={() => handleToggle(task.id)}
                >
                  {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  <span>{task.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Roadmap;
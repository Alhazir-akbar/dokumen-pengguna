// features/stories/components/ProjectMenuDropdown.tsx
'use client';

import { useEffect, useRef, useState, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import ProjectMenuPanel from './ProjectMenuPanel';
import { useProjectMenu } from '@/services/useProjectMenu';

interface ExtraTopAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

interface ProjectMenuDropdownProps {
  workspaceId?: number | null;
  activeProjectId?: string | number | null;
  panelWidth?: number; // px, default 288 (setara w-72)
  extraTopAction?: ExtraTopAction;
  renderTrigger: (props: {
    onClick: () => void;
    isOpen: boolean;
    triggerRef: RefObject<HTMLButtonElement | null>;
  }) => ReactNode;
}

/**
 * Dropdown "Project Menu" yang reusable (dipakai StoriesSidebar & EmptyDetailPanel).
 *
 * Panel-nya dirender lewat React Portal ke document.body, dengan posisi
 * dihitung manual dari getBoundingClientRect() tombol trigger, memakai
 * `position: fixed`. Ini PENTING supaya dropdown TIDAK ke-crop/ketutup oleh
 * ancestor manapun yang punya `overflow-hidden` (di app ini ada beberapa
 * lapis: <main>, root layout div halaman Stories, dst) -- absolute
 * positioning biasa akan kepotong kalau container leluhurnya overflow-hidden,
 * tapi fixed positioning lewat portal tidak terikat batas itu sama sekali.
 *
 * Otomatis buka ke ATAS tombol kalau bakal kepotong di bawah viewport, dan
 * ikut geser kalau bakal kepotong di kanan/kiri layar.
 */
export default function ProjectMenuDropdown({
  workspaceId,
  activeProjectId,
  panelWidth = 288,
  extraTopAction,
  renderTrigger,
}: ProjectMenuDropdownProps) {
  const {
    isOpen,
    toggle,
    close,
    projects,
    handleCreateNewProject,
    goToSettings,
    openProject,
    deleteProject,
  } = useProjectMenu(workspaceId, activeProjectId);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelPos, setPanelPos] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportPadding = 12;
      const estimatedPanelHeight = 340;

      let left = rect.right - panelWidth;
      left = Math.max(viewportPadding, Math.min(left, window.innerWidth - panelWidth - viewportPadding));

      let top = rect.bottom + 6;
      if (top + estimatedPanelHeight > window.innerHeight - viewportPadding) {
        // Bakal kepotong di bawah layar -> buka ke atas tombol sebagai ganti.
        top = Math.max(viewportPadding, rect.top - estimatedPanelHeight - 6);
      }

      setPanelPos({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, panelWidth]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedTrigger = triggerRef.current?.contains(target);
      const clickedPanel = panelRef.current?.contains(target);
      if (!clickedTrigger && !clickedPanel) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  return (
    <>
      {renderTrigger({ onClick: toggle, isOpen, triggerRef })}

      {mounted && isOpen && panelPos && createPortal(
        <div
          ref={panelRef}
          style={{
            position: 'fixed',
            top: panelPos.top,
            left: panelPos.left,
            width: panelWidth,
            zIndex: 9999,
          }}
        >
          <ProjectMenuPanel
            activeProjectId={activeProjectId}
            projects={projects}
            extraTopAction={
              extraTopAction
                ? { ...extraTopAction, onClick: () => { close(); extraTopAction.onClick(); } }
                : undefined
            }
            onCreateNewProject={handleCreateNewProject}
            onGoToSettings={goToSettings}
            onOpenProject={openProject}
            onDeleteProject={deleteProject}
          />
        </div>,
        document.body
      )}
    </>
  );
}
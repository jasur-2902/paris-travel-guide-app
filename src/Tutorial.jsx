import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from './i18n';

const STEPS = [
  { target: '[data-tutorial="tabs"]', position: 'bottom', titleKey: 'tutorial.tabs.title', descKey: 'tutorial.tabs.desc' },
  { target: '[data-tutorial="add-activity"]', position: 'bottom', titleKey: 'tutorial.addActivity.title', descKey: 'tutorial.addActivity.desc' },
  { target: '[data-tutorial="view-toggle"]', position: 'bottom', titleKey: 'tutorial.viewToggle.title', descKey: 'tutorial.viewToggle.desc' },
  { target: '[data-tutorial="weather-pill"]', position: 'bottom', titleKey: 'tutorial.weather.title', descKey: 'tutorial.weather.desc' },
  { target: '[data-tutorial="dark-toggle"]', position: 'bottom', titleKey: 'tutorial.darkMode.title', descKey: 'tutorial.darkMode.desc' },
  { target: '[data-tutorial="settings"]', position: 'left', titleKey: 'tutorial.settings.title', descKey: 'tutorial.settings.desc' },
  { target: '[data-tutorial="budget"]', position: 'top', titleKey: 'tutorial.budget.title', descKey: 'tutorial.budget.desc' },
];

const PAD = 8;
const ARROW_SIZE = 8;
const TOOLTIP_GAP = 12;

function getTargetRect(selector) {
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    top: r.top + window.scrollY - PAD,
    left: r.left + window.scrollX - PAD,
    width: r.width + PAD * 2,
    height: r.height + PAD * 2,
    viewTop: r.top - PAD,
    viewLeft: r.left - PAD,
    element: el,
  };
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export default function Tutorial({ active, onClose }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef(null);
  const activeStepsRef = useRef([]);

  // Build list of active steps (elements that exist in DOM)
  useEffect(() => {
    if (!active) return;
    const available = STEPS.filter(s => document.querySelector(s.target));
    activeStepsRef.current = available;
    setStep(0);
    // Small delay before showing to let elements settle
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, [active]);

  const activeSteps = activeStepsRef.current;
  const currentStep = activeSteps[step];
  const totalSteps = activeSteps.length;

  // Measure target rect
  const measure = useCallback(() => {
    if (!currentStep) return;
    const r = getTargetRect(currentStep.target);
    setRect(r);
  }, [currentStep]);

  useEffect(() => {
    if (!active || !visible) return;
    measure();
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [active, visible, measure]);

  // Scroll target into view
  useEffect(() => {
    if (!active || !visible || !currentStep) return;
    const el = document.querySelector(currentStep.target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      // Re-measure after scroll
      const timer = setTimeout(measure, 350);
      return () => clearTimeout(timer);
    }
  }, [active, visible, step, currentStep, measure]);

  // Keyboard navigation
  useEffect(() => {
    if (!active || !visible) return;
    const handler = (e) => {
      if (e.key === 'Escape') { handleClose(); return; }
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); handleNext(); return; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); handleBack(); return; }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  });

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(s => s + 1);
    else handleClose();
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleClose = () => {
    setVisible(false);
    setStep(0);
    onClose();
  };

  if (!active || !visible || !rect || totalSteps === 0) return null;

  // Calculate tooltip position
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const tooltipW = 300;
  const tooltipH = 180;

  let tooltipStyle = {};
  let arrowClass = '';
  const pos = currentStep.position;

  if (pos === 'bottom') {
    const top = rect.viewTop + rect.height + TOOLTIP_GAP + ARROW_SIZE;
    const left = clamp(rect.viewLeft + rect.width / 2 - tooltipW / 2, 12, vw - tooltipW - 12);
    tooltipStyle = { top: `${top}px`, left: `${left}px` };
    arrowClass = 'tutorial-arrow tutorial-arrow-top';
  } else if (pos === 'top') {
    const top = rect.viewTop - tooltipH - TOOLTIP_GAP - ARROW_SIZE;
    const left = clamp(rect.viewLeft + rect.width / 2 - tooltipW / 2, 12, vw - tooltipW - 12);
    tooltipStyle = { top: `${top}px`, left: `${left}px` };
    arrowClass = 'tutorial-arrow tutorial-arrow-bottom';
  } else if (pos === 'left') {
    const left = rect.viewLeft - tooltipW - TOOLTIP_GAP - ARROW_SIZE;
    const top = clamp(rect.viewTop + rect.height / 2 - tooltipH / 2, 12, vh - tooltipH - 12);
    tooltipStyle = { top: `${top}px`, left: `${Math.max(12, left)}px` };
    arrowClass = 'tutorial-arrow tutorial-arrow-right';
  } else if (pos === 'right') {
    const left = rect.viewLeft + rect.width + TOOLTIP_GAP + ARROW_SIZE;
    const top = clamp(rect.viewTop + rect.height / 2 - tooltipH / 2, 12, vh - tooltipH - 12);
    tooltipStyle = { top: `${left}px`, left: `${top}px` };
    arrowClass = 'tutorial-arrow tutorial-arrow-left';
  }

  // Calculate arrow position relative to tooltip
  let arrowStyle = {};
  if (pos === 'bottom' || pos === 'top') {
    const arrowLeft = clamp(
      rect.viewLeft + rect.width / 2 - parseFloat(tooltipStyle.left) - ARROW_SIZE,
      16, tooltipW - 32
    );
    arrowStyle = { left: `${arrowLeft}px` };
  } else {
    const arrowTop = clamp(
      rect.viewTop + rect.height / 2 - parseFloat(tooltipStyle.top) - ARROW_SIZE,
      16, tooltipH - 32
    );
    arrowStyle = { top: `${arrowTop}px` };
  }

  const isLast = step === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-[9999]" role="dialog" aria-modal="true" aria-label={t('tutorial.tabs.title')}>
      {/* Overlay: click outside closes */}
      <div className="fixed inset-0" onClick={handleClose} />

      {/* Spotlight cutout */}
      <div
        className="tutorial-spotlight"
        style={{
          position: 'fixed',
          top: `${rect.viewTop}px`,
          left: `${rect.viewLeft}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
        }}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[10000] w-[300px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4"
        style={tooltipStyle}
      >
        {/* Arrow */}
        <div className={arrowClass} style={arrowStyle} />

        {/* Step counter */}
        <div className="text-xs text-gray-400 dark:text-gray-500 mb-1.5 font-medium">
          {step + 1} / {totalSteps}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1.5">
          {t(currentStep.titleKey)}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
          {t(currentStep.descKey)}
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleClose}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {t('tutorial.skip')}
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('tutorial.prev')}
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
            >
              {isLast ? t('tutorial.finish') : t('tutorial.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

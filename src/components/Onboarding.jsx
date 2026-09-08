import { useState } from "react";

const GOALS = ["Health", "Focus", "Learning", "Fitness", "Routine", "Personal"];

const STEPS = [
  {
    title: "Welcome 👋",
    body: "Track tiny habits, one tap at a time. No account, no setup — just type a habit and go.",
  },
  {
    title: "What do you want to improve?",
    body: null,
  },
];

export default function Onboarding({ onFinish }) {
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  function handleNext() {
    if (isLast) {
      onFinish();
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <div className="onboarding-overlay" role="dialog" aria-modal="true">
      <div className="onboarding-card">
        <button type="button" className="onboarding-skip" onClick={onFinish}>
          Skip
        </button>

        <div className="onboarding-progress" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={
                i === step ? "onboarding-dot onboarding-dot-active" : "onboarding-dot"
              }
            />
          ))}
        </div>

        <h1 className="text-h1 onboarding-title">{current.title}</h1>

        {current.body && <p className="text-body onboarding-body">{current.body}</p>}

        {step === 1 && (
          <div className="onboarding-goals">
            {GOALS.map((goal) => (
              <button
                key={goal}
                type="button"
                className={
                  selectedGoal === goal
                    ? "onboarding-goal onboarding-goal-selected"
                    : "onboarding-goal"
                }
                onClick={() => setSelectedGoal(goal)}
              >
                {goal}
              </button>
            ))}
          </div>
        )}

        <button type="button" className="onboarding-next" onClick={handleNext}>
          {isLast ? "Get started" : "Next"}
        </button>
      </div>
    </div>
  );
}

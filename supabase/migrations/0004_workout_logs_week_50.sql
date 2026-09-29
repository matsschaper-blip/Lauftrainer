-- Lauftrainer · week-Constraint auf den 50-Wochen-Plan erweitern
-- Hintergrund: 0001 erlaubte nur Woche 1–22; ab Plan-Woche 23 schlug jeder
-- Workout-Insert fehl.

alter table public.workout_logs
  drop constraint if exists workout_logs_week_check;

alter table public.workout_logs
  add constraint workout_logs_week_check
  check (week between 1 and 50);

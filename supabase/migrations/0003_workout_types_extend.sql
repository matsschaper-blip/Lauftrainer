-- Lauftrainer · Workout-Type Union erweitern
-- Hintergrund: 50-Wochen-Plan Sub-1:45 fügt threshold / vo2 / strides als
-- eigenständige Trainingstypen ein (Pyramidal→Polarized-Periodisierung).

alter table public.workout_logs
  drop constraint if exists workout_logs_type_check;

alter table public.workout_logs
  add constraint workout_logs_type_check
  check (type in ('easy','long','tempo','threshold','vo2','strides','race','test'));

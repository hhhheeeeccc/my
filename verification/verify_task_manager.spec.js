import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Verify Task Manager Component and SCSS existence', async () => {
  const tsxPath = path.resolve('plugins/com.workspace.tasks/webapp/task_manager_modal.tsx');
  const scssPath = path.resolve('plugins/com.workspace.tasks/webapp/task_manager_modal.scss');

  expect(fs.existsSync(tsxPath)).toBe(true);
  expect(fs.existsSync(scssPath)).toBe(true);

  const tsxContent = fs.readFileSync(tsxPath, 'utf-8');
  expect(tsxContent).toContain('TaskManagerModal');
});

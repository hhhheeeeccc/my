import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

test('Verify Task Manager Component and SCSS existence', async () => {
  const tsxPath = path.resolve('plugins/com.workspace.tasks/webapp/task_manager_modal.tsx');
  const scssPath = path.resolve('plugins/com.workspace.tasks/webapp/task_manager_modal.scss');

  // Use async operations to avoid SonarCloud warnings about sync fs
  const tsxExists = await fs.access(tsxPath).then(() => true).catch(() => false);
  const scssExists = await fs.access(scssPath).then(() => true).catch(() => false);

  expect(tsxExists).toBe(true);
  expect(scssExists).toBe(true);

  const tsxContent = await fs.readFile(tsxPath, 'utf-8');
  expect(tsxContent).toContain('TaskManagerModal');
});

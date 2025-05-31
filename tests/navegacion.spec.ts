
import { test, expect, Page } from '@playwright/test';


async function loginAsAdmin(page: Page) {
  await page.goto('http://localhost:4200/home');
  
  await page.getByRole('button', { name: 'Toggle navigation' }).click();

  
  const iniciarSesionLink = page.getByRole('link', { name: 'Iniciar Sesión' });
  await expect(iniciarSesionLink).toBeVisible();
  await iniciarSesionLink.click();

 
  await expect(page).toHaveURL('http://localhost:4200/login');
  await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();

  
  await page.locator('#ad').fill('ricardo');
  await page.locator('#pwd').fill('123');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

  
  await expect(page).toHaveURL('http://localhost:4200/home');
 
  await page.waitForLoadState('domcontentloaded'); 
}

test.describe('Flujo Completo de Navegación de la Aplicación', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:4200/home'); 
    await page.evaluate(() => {
        const swal = document.querySelector('.swal2-container');
        if (swal) swal.remove();
        document.body.style.overflow = '';
    });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('debería navegar correctamente a todas las secciones y manejar login/logout', async () => {
    await test.step('1. Verificar estado inicial y navegación a Home', async () => {
      await page.goto('http://localhost:4200/home');
      await expect(page).toHaveURL('http://localhost:4200/home');
      await expect(page.getByRole('heading', { name: 'Catálogo de Vehículos' })).toBeVisible();
      await expect(page.locator('.footer-text', { hasText: '2025' })).toBeVisible();

     
      await page.getByRole('button', { name: 'Toggle navigation' }).click();
     
      await expect(page.locator('.offcanvas.show')).toBeVisible({ timeout: 10000 }); 
      
      await expect(page.getByRole('link', { name: 'Iniciar Sesión' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Gestión Vehículos' })).not.toBeVisible();
      await expect(page.getByRole('link', { name: 'Gestión Administradores' })).not.toBeVisible();
      await expect(page.getByRole('link', { name: 'Cerrar Sesión' })).not.toBeVisible();
      await page.getByRole('button', { name: 'Close' }).click(); 
     
      await expect(page.getByRole('link', { name: 'Iniciar Sesión' })).not.toBeVisible();
    });

    await test.step('2. Iniciar sesión como administrador', async () => {
      await loginAsAdmin(page);
      
      await page.getByRole('button', { name: 'Toggle navigation' }).click();
    
      await expect(page.locator('.offcanvas.show')).toBeVisible({ timeout: 10000 }); 
     
      await expect(page.getByRole('link', { name: 'Gestión Vehículos' })).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('link', { name: 'Gestión Administradores' })).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('link', { name: 'Cerrar Sesión' })).toBeVisible({ timeout: 10000 }); 
      await expect(page.getByRole('link', { name: 'Iniciar Sesión' })).not.toBeVisible();
      await page.getByRole('button', { name: 'Close' }).click(); 
    });

    await test.step('3. Navegar a Gestión de Vehículos', async () => {

      await page.getByRole('button', { name: 'Toggle navigation' }).click();
      await expect(page.locator('.offcanvas.show')).toBeVisible({ timeout: 10000 }); 
      const gestionVehiculosLink = page.getByRole('link', { name: 'Gestión Vehículos' });
      await expect(gestionVehiculosLink).toBeVisible();
      await gestionVehiculosLink.click();
      await expect(page).toHaveURL('http://localhost:4200/vehiculo');
      await expect(page.locator('.spinner-border')).not.toBeVisible();
      await expect(page.locator('table.table')).toBeVisible();
      await expect(page.locator('.footer-text', { hasText: '2025' })).toBeVisible();
    });

    await test.step('4. Navegar a Gestión de Administradores', async () => {

      await page.getByRole('button', { name: 'Toggle navigation' }).click();
      await expect(page.locator('.offcanvas.show')).toBeVisible({ timeout: 10000 }); 
      const gestionAdminsLink = page.getByRole('link', { name: 'Gestión Administradores' });
      await expect(gestionAdminsLink).toBeVisible();
      await gestionAdminsLink.click();
      await expect(page).toHaveURL('http://localhost:4200/administrador');
      await expect(page.locator('.spinner-border')).not.toBeVisible();
      await expect(page.getByRole('heading', { name: 'Lista de Administradores' })).toBeVisible();
      await expect(page.locator('.footer-text', { hasText: '2025' })).toBeVisible();
    });

    await test.step('5. Cerrar sesión', async () => {

      await page.getByRole('button', { name: 'Toggle navigation' }).click();
      await expect(page.locator('.offcanvas.show')).toBeVisible({ timeout: 10000 }); 
      const cerrarSesionLink = page.getByRole('link', { name: 'Cerrar Sesión' });
      await expect(cerrarSesionLink).toBeVisible();
      await cerrarSesionLink.click();

      await expect(page).toHaveURL('http://localhost:4200/home');

      await page.getByRole('button', { name: 'Toggle navigation' }).click();
      await expect(page.locator('.offcanvas.show')).toBeVisible({ timeout: 10000 }); 
      await expect(page.getByRole('link', { name: 'Iniciar Sesión' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Gestión Vehículos' })).not.toBeVisible();
      await page.getByRole('button', { name: 'Close' }).click(); 
      await expect(page.locator('.footer-text', { hasText: '2025' })).toBeVisible();
    });
  });
});
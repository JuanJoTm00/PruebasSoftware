// navegacion.spec.ts
import { test, expect, Page } from '@playwright/test';

// Función auxiliar para login
async function loginAsAdmin(page: Page) {
  await page.goto('http://localhost:4200/home');
  // Click en el icono de hamburguesa para abrir el offcanvas
  await page.getByRole('button', { name: 'Toggle navigation' }).click();

  // Esperar a que el enlace "Iniciar Sesión" esté visible y hacer clic
  const iniciarSesionLink = page.getByRole('link', { name: 'Iniciar Sesión' });
  await expect(iniciarSesionLink).toBeVisible();
  await iniciarSesionLink.click();

  // Aserción: Verificar que estamos en la página de inicio de sesión
  await expect(page).toHaveURL('http://localhost:4200/login');
  await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();

  // Llenar los campos de login
  await page.locator('#ad').fill('ricardo');
  await page.locator('#pwd').fill('123');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

  // Aserción: Verificar que el inicio de sesión fue exitoso (redirigido al home)
  await expect(page).toHaveURL('http://localhost:4200/home');
  // Esperar a que la página esté completamente cargada después del login
  await page.waitForLoadState('domcontentloaded'); // o 'networkidle'
}

test.describe('Flujo Completo de Navegación de la Aplicación', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:4200/home'); // Asegurarse de estar en el home al inicio de cada test
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

      // Abrir el offcanvas para verificar los enlaces de pre-login
      await page.getByRole('button', { name: 'Toggle navigation' }).click();
      // Esperar a que el offcanvas esté visible (ej. por su clase `show` o `offcanvas-start`)
      await expect(page.locator('.offcanvas.show')).toBeVisible({ timeout: 10000 }); // Aumentar timeout
      
      await expect(page.getByRole('link', { name: 'Iniciar Sesión' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Gestión Vehículos' })).not.toBeVisible();
      await expect(page.getByRole('link', { name: 'Gestión Administradores' })).not.toBeVisible();
      await expect(page.getByRole('link', { name: 'Cerrar Sesión' })).not.toBeVisible();
      await page.getByRole('button', { name: 'Close' }).click(); // Cerrar offcanvas
      // Después de cerrar, el enlace de "Iniciar Sesión" tampoco debe estar visible
      await expect(page.getByRole('link', { name: 'Iniciar Sesión' })).not.toBeVisible();
    });

    await test.step('2. Iniciar sesión como administrador', async () => {
      await loginAsAdmin(page);
      // Después del login, abrimos el offcanvas para verificar los enlaces de admin
      await page.getByRole('button', { name: 'Toggle navigation' }).click();
      // Esperar a que el offcanvas esté visible después de abrirlo nuevamente
      await expect(page.locator('.offcanvas.show')).toBeVisible({ timeout: 10000 }); // Aumentar timeout

      // Verificar que los enlaces de administración y "Cerrar Sesión" DEBEN ser visibles
      await expect(page.getByRole('link', { name: 'Gestión Vehículos' })).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('link', { name: 'Gestión Administradores' })).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('link', { name: 'Cerrar Sesión' })).toBeVisible({ timeout: 10000 }); // Esta es la línea que falla
      // Y "Iniciar Sesión" NO debe estar visible
      await expect(page.getByRole('link', { name: 'Iniciar Sesión' })).not.toBeVisible();
      await page.getByRole('button', { name: 'Close' }).click(); // Cerrar offcanvas
    });

    await test.step('3. Navegar a Gestión de Vehículos', async () => {
      // Necesitamos abrir el offcanvas para navegar
      await page.getByRole('button', { name: 'Toggle navigation' }).click();
      await expect(page.locator('.offcanvas.show')).toBeVisible({ timeout: 10000 }); // Esperar offcanvas abierto
      const gestionVehiculosLink = page.getByRole('link', { name: 'Gestión Vehículos' });
      await expect(gestionVehiculosLink).toBeVisible();
      await gestionVehiculosLink.click();
      await expect(page).toHaveURL('http://localhost:4200/vehiculo');
      await expect(page.locator('.spinner-border')).not.toBeVisible();
      await expect(page.locator('table.table')).toBeVisible();
      await expect(page.locator('.footer-text', { hasText: '2025' })).toBeVisible();
    });

    await test.step('4. Navegar a Gestión de Administradores', async () => {
      // Necesitamos abrir el offcanvas para navegar
      await page.getByRole('button', { name: 'Toggle navigation' }).click();
      await expect(page.locator('.offcanvas.show')).toBeVisible({ timeout: 10000 }); // Esperar offcanvas abierto
      const gestionAdminsLink = page.getByRole('link', { name: 'Gestión Administradores' });
      await expect(gestionAdminsLink).toBeVisible();
      await gestionAdminsLink.click();
      await expect(page).toHaveURL('http://localhost:4200/administrador');
      await expect(page.locator('.spinner-border')).not.toBeVisible();
      await expect(page.getByRole('heading', { name: 'Lista de Administradores' })).toBeVisible();
      await expect(page.locator('.footer-text', { hasText: '2025' })).toBeVisible();
    });

    await test.step('5. Cerrar sesión', async () => {
      // Abrir el offcanvas para poder hacer clic en "Cerrar Sesión"
      await page.getByRole('button', { name: 'Toggle navigation' }).click();
      await expect(page.locator('.offcanvas.show')).toBeVisible({ timeout: 10000 }); // Esperar offcanvas abierto
      const cerrarSesionLink = page.getByRole('link', { name: 'Cerrar Sesión' });
      await expect(cerrarSesionLink).toBeVisible();
      await cerrarSesionLink.click();

      await expect(page).toHaveURL('http://localhost:4200/home');
      // Abrir offcanvas de nuevo para verificar el enlace de Iniciar Sesión
      await page.getByRole('button', { name: 'Toggle navigation' }).click();
      await expect(page.locator('.offcanvas.show')).toBeVisible({ timeout: 10000 }); // Esperar offcanvas abierto
      await expect(page.getByRole('link', { name: 'Iniciar Sesión' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Gestión Vehículos' })).not.toBeVisible();
      await page.getByRole('button', { name: 'Close' }).click(); // Cerrar offcanvas
      await expect(page.locator('.footer-text', { hasText: '2025' })).toBeVisible();
    });
  });
});
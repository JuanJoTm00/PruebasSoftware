
import { test, expect, Page } from '@playwright/test';


async function loginAsAdmin(page: Page) {
  await page.goto('http://localhost:4200/home');
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.getByRole('link', { name: 'Iniciar Sesión' }).click();
  await expect(page).toHaveURL('http://localhost:4200/login');
  await page.locator('#ad').fill('ricardo');
  await page.locator('#pwd').fill('123');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await expect(page).toHaveURL('http://localhost:4200/home');
}

test.describe('Flujo Completo de Contenido: Gestión de Vehículos (CRUD)', () => {
  let page: Page;
  const newVehiculoMarca = `MarcaTest-${Date.now()}`;
  const newVehiculoModelo = `ModeloTest-${Date.now()}`;
  const newVehiculoAno = '2023';
  const newVehiculoKilometraje = '1000';
  const newVehiculoTipo = 'Carro';
  const newVehiculoDescripcion = 'Descripción del vehículo de prueba.';
  const newVehiculoImagenPrincipal = 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Principal';
  const newVehiculoImagenAdicional1 = 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Adicional1';
  const newVehiculoImagenAdicional2 = 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Adicional2';

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:4200/home');
    await page.evaluate(() => {
        const swal = document.querySelector('.swal2-container');
        if (swal) swal.remove();
        document.body.style.overflow = '';
    });
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('debería completar el flujo de CRUD de vehículos y visualización de detalles', async () => {
    await test.step('1. Iniciar sesión y navegar a Gestión Vehículos', async () => {
      await loginAsAdmin(page);
      await page.getByRole('button', { name: 'Toggle navigation' }).click();
      await expect(page.locator('.offcanvas.show')).toBeVisible(); 
      const gestionVehiculosLink = page.getByRole('link', { name: 'Gestión Vehículos' });
      await expect(gestionVehiculosLink).toBeVisible();
      await gestionVehiculosLink.click();
      await expect(page).toHaveURL('http://localhost:4200/vehiculo');
      await expect(page.locator('.spinner-border')).not.toBeVisible();
      await expect(page.locator('table.table')).toBeVisible();
    });

    await test.step('2. Crear un nuevo vehículo con imágenes', async () => {
      await page.getByRole('button', { name: 'Nuevo' }).click();
      await expect(page.getByRole('heading', { name: 'Nuevo Vehiculo' })).toBeVisible();

      await page.locator('#Marca').fill(newVehiculoMarca);
      await page.locator('#Modelo').fill(newVehiculoModelo);
      await page.locator('#Ano').fill(newVehiculoAno);
      await page.locator('#Kilometraje').fill(newVehiculoKilometraje);
      await page.locator('#Tipo').fill(newVehiculoTipo);
      await page.locator('#Descripcion').fill(newVehiculoDescripcion);
      await page.locator('#ImagenPrincipal').fill(newVehiculoImagenPrincipal);

      await page.getByPlaceholder('Ingrese la URL de una imagen').fill(newVehiculoImagenAdicional1);
      await page.getByRole('button', { name: 'Agregar Imagen' }).click();
      await expect(page.getByText('Imagen añadida localmente')).toBeVisible();
      await page.getByRole('button', { name: 'OK' }).click();

      await page.getByPlaceholder('Ingrese la URL de una imagen').fill(newVehiculoImagenAdicional2);
      await page.getByRole('button', { name: 'Agregar Imagen' }).click();
      await expect(page.getByText('Imagen añadida localmente')).toBeVisible();
      await page.getByRole('button', { name: 'OK' }).click();

      await expect(page.locator(`ul.list-group li:has-text("${newVehiculoImagenAdicional1}") img[src="${newVehiculoImagenAdicional1}"]`)).toBeVisible();
      await expect(page.locator(`ul.list-group li:has-text("${newVehiculoImagenAdicional2}") img[src="${newVehiculoImagenAdicional2}"]`)).toBeVisible();

      await page.getByRole('button', { name: 'Guardar' }).click();

      await expect(page.getByText('Vehículo agregado correctamente')).toBeVisible();
      await page.getByRole('button', { name: 'OK' }).click();

      const newVehiculoRow = page.locator(`table.table tr:has-text("${newVehiculoMarca}"):has-text("${newVehiculoModelo}")`);
      await expect(newVehiculoRow).toBeVisible();
    });

    await test.step('3. Editar el vehículo recién creado', async () => {
      const editedVehiculoMarca = `${newVehiculoMarca} Editado`;
      const rowToEdit = page.locator(`table.table tr:has-text("${newVehiculoMarca}")`);
      await expect(rowToEdit).toBeVisible();

      await rowToEdit.getByRole('button', { name: 'Editar' }).click();
      await expect(page.getByRole('heading', { name: `Editar Vehiculo ${newVehiculoMarca} ${newVehiculoModelo}` })).toBeVisible();

      await page.locator('#Marca').fill(editedVehiculoMarca);

      const imgToDeleteRow = page.locator(`ul.list-group li:has-text("${newVehiculoImagenAdicional1}")`);
      await expect(imgToDeleteRow).toBeVisible();
      await imgToDeleteRow.getByRole('button', { name: 'Eliminar' }).click();
      await expect(page.getByText('¿Estás seguro de eliminar esta imagen?')).toBeVisible();
      await page.getByRole('button', { name: 'Sí, eliminar' }).click();
      await expect(page.getByText('Imagen eliminada correctamente')).toBeVisible();
      await page.getByRole('button', { name: 'OK' }).click();
      await expect(imgToDeleteRow).not.toBeVisible();

      await page.getByRole('button', { name: 'Guardar' }).click();

      await expect(page.getByText('Vehículo actualizado correctamente')).toBeVisible();
      await page.getByRole('button', { name: 'OK' }).click();

      const updatedVehiculoRow = page.locator(`table.table tr:has-text("${editedVehiculoMarca}"):has-text("${newVehiculoModelo}")`);
      await expect(updatedVehiculoRow).toBeVisible();
      await expect(page.locator(`table.table tr:has-text("${newVehiculoMarca}")`)).not.toBeVisible();
    });

    await test.step('4. Ver detalles del vehículo desde el Home (Catálogo)', async () => {
      await page.goto('http://localhost:4200/home');
      await expect(page.getByRole('heading', { name: 'Catálogo de Vehículos' })).toBeVisible();
      await expect(page.locator('.card-body')).toBeVisible();

      const vehiculoCard = page.locator(`.card:has-text("${newVehiculoMarca} Editado"):has-text("${newVehiculoModelo}")`);
      await expect(vehiculoCard).toBeVisible();
      await vehiculoCard.getByRole('button', { name: 'Ver Detalles' }).click();

      await expect(page.getByRole('heading', { name: `Detalles del Vehículo: ${newVehiculoMarca} Editado ${newVehiculoModelo}` })).toBeVisible();
      await expect(page.getByText(`Año: ${newVehiculoAno}`)).toBeVisible();
      await expect(page.getByText(`Kilometraje: ${newVehiculoKilometraje} km`)).toBeVisible();
      await expect(page.getByText(`Descripción: ${newVehiculoDescripcion}`)).toBeVisible();

      await expect(page.locator(`.carousel-item img[src="${newVehiculoImagenPrincipal}"]`)).toBeVisible();
      await expect(page.locator(`.carousel-item img[src="${newVehiculoImagenAdicional2}"]`)).toBeVisible();
      await expect(page.locator(`.carousel-item img[src="${newVehiculoImagenAdicional1}"]`)).not.toBeVisible();

      const nextButton = page.getByRole('button', { name: 'Next' });
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }

      await page.getByRole('button', { name: 'Cerrar' }).click();
      await expect(page.locator('#vehiculoDetalleModal')).not.toBeVisible();
    });

    await test.step('5. Eliminar el vehículo editado', async () => {
      await page.goto('http://localhost:4200/vehiculo');
      await expect(page.locator('.spinner-border')).not.toBeVisible();
      await expect(page.locator('table.table')).toBeVisible();

      const vehiculoToDeleteName = `${newVehiculoMarca} Editado`;
      const rowToDelete = page.locator(`table.table tr:has-text("${vehiculoToDeleteName}")`);
      await expect(rowToDelete).toBeVisible();

      await rowToDelete.getByRole('button', { name: 'Eliminar' }).click();

      await expect(page.getByText('¿Estás seguro?')).toBeVisible();
      await page.getByRole('button', { name: 'Sí, eliminar' }).click();

      await expect(page.getByText('Vehículo eliminado')).toBeVisible();
      await page.getByRole('button', { name: 'OK' }).click();

      await expect(page.locator(`table.table tr:has-text("${vehiculoToDeleteName}")`)).not.toBeVisible();
      await expect(page.locator(`table.table tr:has-text("${newVehiculoModelo}")`)).not.toBeVisible();
    });

    await test.step('6. Cerrar sesión', async () => {
      await page.getByRole('button', { name: 'Toggle navigation' }).click();
      await page.getByRole('link', { name: 'Cerrar Sesión' }).click();
      await expect(page).toHaveURL('http://localhost:4200/home');
      await expect(page.getByRole('link', { name: 'Iniciar Sesión' })).toBeVisible();
    });
  });
});
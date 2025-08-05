import { parallelTest as test } from '../../../../parallelTest';
import { expect } from '@playwright/test';
import WpAdminPage from '../../../../pages/wp-admin-page';
import _path from 'path';

test.describe( 'Hello Plus Header', () => {
        test( 'Assert that the dropdown button does not inherit the background color from the theme settings', async ( { page, apiRequests }, testInfo ) => {
                const wpAdmin = new WpAdminPage( page, testInfo, apiRequests );
                const editor = await wpAdmin.openNewPage();

                await test.step( 'Update Hello Commerce style settings', async () => {
                        await editor.openSiteSettings( 'theme-style-buttons' );

                        const backgroundColorControl = editor.page.locator( '.elementor-control-button_background_color' );

                        if ( ! await backgroundColorControl.isVisible() ) {
                                await editor.setChooseControlValue( 'button_background_color_background', 'eicon-paint-brush' );
                        }

                        await editor.setColorControlValue( 'button_background_color', '#3bc7b6' );

                        await editor.saveSiteSettingsWithTopBar( false );
                } );

                await test.step( 'Create a new menu', async () => {
                        await wpAdmin.gotoDashboard();
                        await wpAdmin.createNewMenu( 'Dropdown menu' );
                } );

                await test.step( 'Create a new header', async () => {
                        const filePath = _path.resolve( __dirname, `../../../../templates/hello-plus-header-template.json` );
                        await wpAdmin.gotoDashboard();
                        await editor.importTemplateUI( filePath );
                        await wpAdmin.closeAnnouncementsIfVisible();
                        await page.getByRole( 'button', { name: 'Publish' } ).click();
                } );

                await test.step( 'Assert dropdown menu button style', async () => {
                        await editor.page.goto( '/' );
                        await expect.soft( editor.page.getByRole( 'button', { name: 'Parent menu item' } ) ).toHaveScreenshot( 'header-parent-menu-item.png' );
                } );
        } );
} );

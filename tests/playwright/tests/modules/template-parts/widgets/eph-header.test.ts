import { parallelTest as test } from '../../../../parallelTest';
import { expect } from '@playwright/test';
import WpAdminPage from '../../../../pages/wp-admin-page';

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

                        await editor.setColorControlValue( 'button_background_color', '#981C21' );

                        await editor.saveSiteSettingsWithTopBar( false );
                } );

                // await test.step( 'Create a new menu', async () => {
                //         await wpAdmin.gotoDashboard();

                //         await editor.page.pause();
                // } );

                await test.step( 'Create a new header', async () => {
                        await wpAdmin.gotoDashboard();
                        await page.getByRole( 'link', { name: 'Templates', exact: true } ).click();
                        await page.getByRole( 'link', { name: 'Hello+ Header' } ).first().click();

                        if ( await page.locator( '.wp-list-table' ).first().locator( '[type="checkbox"]' ).first().isVisible() ) {
                                await page.locator( '.wp-list-table' ).first().locator( '[type="checkbox"]' ).first().check();
                                await page.locator( '#bulk-action-selector-top' ).selectOption( 'trash' );
                                await page.locator( '#doaction' ).click();
                        }

                        await page.getByRole( 'link', { name: 'Add New Hello+ Header' } ).click();
                        await page.getByRole( 'button', { name: 'Create Template' } ).click();

                        await wpAdmin.waitForEditorToLoad();
                        await page.locator( '.elementor-template-library-template-body' ).first().hover();
                        await page.locator( '.elementor-template-library-template-action' ).first().click();

                        if ( await page.locator( '.a#elementor-template-library-connect__button' ).isVisible() ) {
                                await page.locator( '.a#elementor-template-library-connect__button' ).click();
                        }

                        if ( await page.locator( 'a.e-connect-action-button' ).isVisible() ) {
                                await page.locator( 'a.e-connect-action-button' ).click();
                        }

                        await wpAdmin.closeAnnouncementsIfVisible();
                        await editor.publishPage();
                } );

                await test.step( 'Assert dropdown button style', async () => {
                        await editor.page.goto( '/' );

                        await expect.soft( editor.page.locator( 'header' ) ).toHaveScreenshot( 'header.png' );
                } );
        } );
} );

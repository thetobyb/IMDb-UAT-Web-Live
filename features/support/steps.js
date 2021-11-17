/*
 ******************************************************************************
 * Cucumber/Gherkin
 * ============================================================================
 * 
 * NOTES:
 * - Arrow functions not supported by cucumber when accessing the 'world' class
 *   SEE: github.com/cucumber/cucumber-js/blob/main/docs/support_files/world.md
 * 
 ******************************************************************************
*/

const {After, Before, Given, Then, When} = require('@cucumber/cucumber');
const assert = require('assert');
const path = require('path');
const timeout = 10000;

Before({timeout}, async function() {
    this.browserBuild();
});

After({timeout}, async function() {
    await this.browserExit();
});

Given('the {word} page', {timeout}, async function(page) {
    const pages = {
        'news': 'https://www.bbc.co.uk/news',
        'weather': 'https://www.bbc.co.uk/weather'
    }

    assert((pages[page] != null), 'Page not supported!');
    await this.browserNavigate(pages[page]);
});

When('the {string} location is searched for', async function(location) {
    this.text = location;

    const searchInput = await this.getElement('ls-c-search__input-label');
    const searchSubmit = await this.getElementByCss('[type="submit"].ls-c-search__submit');

    await searchInput.sendKeys(location);
    await searchSubmit.click();
    await this.waitForElementByCss('.wr-c-observations__heading', timeout);
});

Then('the {string} element should be {word}', async function(name, state) {
    const ids = {
        'location heading': 'wr-location-name-id',
        'search input': 'ls-c-search__input-label',
        'search submit': '[type="submit"].ls-c-search__submit'
    };

    const selectors = {
        'location heading': 'getElement',
        'search input': 'getElement',
        'search submit': 'getElementByCss'
    };

    const tags = {
        'location heading': 'h1',
        'search input': 'input',
        'search submit': 'input'
    };

    const id = ids[name];
    const selector = selectors[name];
    const tag = tags[name];

    assert((id != null), 'Element not supported!');
    assert((selector != null), 'Selector not supported!');
    assert((tag != null), 'Tag not supported!');

    switch(state) {
        case 'matching':
        case 'there': {
            const element = await this[selector](id);
            const actualTag = await element.getTagName();
            assert((actualTag == tag), 'Element is not of the correct type!');

            if (state == 'matching') {
                const actualText = await element.getText();
                console.log('ACTUAL TEXT: '+actualText+'!');
                assert((actualText == this.text), 'Element text does not match!');
            }
            
            break;
        }

        case 'missing': {
            assert.rejects(async () => await this[selector](id), 'Element exists when it should not!');
            break;
        }
        
        default: {
            assert.fail('State not supported!');
            break;
        }
    }
});
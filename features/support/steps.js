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
        'imdb': 'https://www.imdb.com/',
    }

    assert((pages[page] != null), 'Page not supported!');
    await this.browserNavigate(pages[page]);
});

When('the {string} film is searched for', async function(film) {
    this.text = film;

    const searchInput = await this.getElement('suggestion-search');
    const searchSubmit = await this.getElementByCss('[type="submit"]#suggestion-search-button');

    await searchInput.sendKeys(film);
    await searchSubmit.click();
    
});

Then('the {string} element should be {word}', async function(name, state) {
    const ids = {
        'film heading': '.findSearchTerm',
        'search input': 'suggestion-search',
        'search submit': '[type="submit"]#suggestion-search-button'
    };

    const selectors = {

        'film heading': 'getElementByCss',
        'search input': 'getElement',
        'search submit': 'getElementByCss'

    };

    const tags = {

        'film heading': 'span',
        'search input': 'input',
        'search submit': 'button'
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
                assert((actualText.slice(1,-1) == this.text), 'Element text does not match!');
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
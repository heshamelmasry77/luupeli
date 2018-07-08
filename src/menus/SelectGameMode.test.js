const puppeteer = require('puppeteer')

let browser
let page

beforeAll(async () => {
	browser = await puppeteer.launch({args: ['--no-sandbox']})
	page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('http://localhost:3000')
})

beforeEach(async () => {
	page = await browser.newPage()
  await page.goto('http://localhost:3000/game')
})

afterEach(async () => {
	await page.close()
})

afterAll(async () => {
	await browser.close()
})

describe("SelectGameMode tests", () => {
  test('page renders', async () => {
    const textContent = await page.$eval('#gameBody', el => el.textContent)
    expect(textContent.includes("Luupelimuoto")).toBe(true)
  }, 20000)

  test('Takaisin button redirects back to main page', async () => {
    await page.click('#goBackButton')
    const textContent = await page.$eval('#btn-group', el => el.textContent)
    expect(textContent.includes("Pelaa")).toBe(true)
  })
})


// import React from 'react'
// import { shallow } from 'enzyme'
// import { Link } from 'react-router-dom'
// import SelectGameMode from './SelectGameMode'

// describe("SelectGameMode", () => {

//     var localStorageMock = (function() {
//       var store = {};
//       return {
//         getItem: function(key) {
//           return store[key];
//         },
//         setItem: function(key, value) {
//           store[key] = value.toString();
//         },
//         clear: function() {
//           store = {};
//         },
//         removeItem: function(key) {
//           delete store[key];
//         }
//       };
//     })();
//     Object.defineProperty(window, 'localStorage', { value: localStorageMock });

//     const gamemode = () => {
//         const component = shallow(<SelectGameMode />)
//         return component;
//     }

//     it('has the text "Valitse"', () => {
//         const res = gamemode().find('.toprow')
//         expect(res.text()).toContain('Valitse')
//     })

//     it('has the text "Luupelimuoto:"', () => {
//         // const res = gamemode().find('.secondrow')
//         // expect(res.text()).toContain('Luupelimuoto:')
//     })

//     it('has "Kirjoituspeli" (writing game) as one of the game modes', () => {
//         // const res = gamemode().find('.writinggame')
//         // expect(res.text()).toContain('Kirjoituspeli')
//     })

//     //broken..
//     //it('has a "Takaisin" button for going back to the previous page', () => {
//         //const res = gamemode().find('.gobackbutton')
//         //expect(res.text()).toContain('Takaisin')
//     //})

//     it('renders Links', () => {
//         // expect(gamemode().find(Link).length).toBeGreaterThan(0)
//     })

//     it('renders buttons', () => {
//         // expect(gamemode().find("button").length).toBeGreaterThan(0)
//     })
// })
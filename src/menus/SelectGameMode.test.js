import React from 'react'
import { shallow } from 'enzyme'
import { Link } from 'react-router-dom'
import SelectGameMode from './SelectGameMode'

describe("SelectGameMode", () => {
    const gamemode = () => {
        const component = shallow(<SelectGameMode />)
        return component;
    }

    it('has the text "Valitse"', () => {
        const res = gamemode().find('.toprow')
        expect(res.text()).toContain('Valitse')
    })

    it('has the text "Luupelimuoto:"', () => {
        const res = gamemode().find('.secondrow')
        expect(res.text()).toContain('Luupelimuoto:')
    })

    it('has "Kirjoituspeli" (writing game) as one of the game modes', () => {
        const res = gamemode().find('.writinggame')
        expect(res.text()).toContain('Kirjoituspeli')
    })

    it('has a "Takaisin" button for going back to the previous page', () => {
        const res = gamemode().find('.gobackbutton')
        expect(res.text()).toContain('Takaisin')
    })

    it('renders Links', () => {
        expect(gamemode().find(Link).length).toBeGreaterThan(0)
    })

    it('renders buttons', () => {
        expect(gamemode().find("button").length).toBeGreaterThan(0)
    })
})
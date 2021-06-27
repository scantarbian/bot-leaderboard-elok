require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const UserAgent = require('user-agents');
const schedule = require('node-schedule');

// block pdf 
puppeteer.use(require('puppeteer-extra-plugin-block-resources')({
    blockedTypes: new Set(['xhr', 'image'])
}))

// run new instance every 10 secs = ez push rank 
// (emerald in 3 hours - assuming non stop run)
schedule.scheduleJob("*/10 * * * * *" , async() => { 
    // will fire every hour (0 * * * *)
    // will fire every minute (*/1 * * * *)
    // will fire every second (*/1 * * * * *)
    puppeteer.launch({
        headless:true,
    }).then(async browser => {
        const username = process.env.UNAME
        const password = process.env.PASSWORD
    
        const page = await browser.newPage();
        const userAgent = new UserAgent({ deviceCategory : 'desktop' }).toString();
    
        await page.setUserAgent(userAgent);
        await page.setDefaultNavigationTimeout(0);
    
        await page.goto(process.env.COURSE_URL, { waitUntil: 'networkidle2' });
    
        await page.evaluate(() => { // login with SSO
            document.querySelector('#page-header-nav > div > div > div > div > a').click()
        })
        await page.waitForNavigation({ waitUntil: 'networkidle2' })
    
        // SSO login handler
        await page.type('#username', username);
        await page.type('#password', password);
        await page.evaluate(() => { // login with SSO
            document.querySelector('#fm1 > input.btn.btn-primary').click()
        })
        await page.waitForNavigation({ waitUntil: 'networkidle2' })
    
        // here we're already on the course's page
        // click on all materials, open them on a new page, then close
        // do this every minute (to prevent signing out lmao)
        const expData = await page.evaluate(() => {
            const currentExp = document.querySelector('div.block_xp-xp:nth-child(1) > div:nth-child(1)').innerText;
            const remainingExpToNextLevel = document.querySelector('div.block_xp-xp:nth-child(2) > div:nth-child(1)').innerText;
    
            return({
                current: currentExp,
                remaining: remainingExpToNextLevel
            })
        })
        console.log(`${expData.current} XP total | ${expData.remaining} XP needed until next level`)
    
        // open all the materials
        const target = await page.$x("//span[contains(., 'Presentation Material')]")
        for (const el of target){
            await el.click({button: "middle"}); // open in new tab

            // https://github.com/puppeteer/puppeteer/issues/3718
            // https://stackoverflow.com/a/62612102/13220209
            const getNewPageWhenLoaded =  async () => {
                return new Promise(x =>
                    browser.on('targetcreated', async target => {
                        if (target.type() === 'page') {
                            const newPage = await target.page();
                            const newPagePromise = new Promise(y =>
                                newPage.once('domcontentloaded', () => y(newPage))
                            );
                            const isPageLoaded = await newPage.evaluate(
                                () => document.readyState
                            );
                            return isPageLoaded.match('complete|interactive')
                                ? x(newPage)
                                : x(newPagePromise);
                        }
                    })
                );
            };
        
        
            const newPagePromise = getNewPageWhenLoaded();
            const newPage = await newPagePromise;
        }
    
        await browser.close();
    })
});
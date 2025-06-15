
// tests/selenium-tests.js

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
//const startBackend = require('./startBackend.js')

async function runTests() {
    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments(`--user-data-dir=/tmp/chrome-profile-${Date.now()}`);

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        const baseUrl = 'http://16.171.24.108:5100'; // replace with actual address

	// Test 1: Navigate to cart
        await driver.get(`${baseUrl}/login`);
        await driver.findElement(By.name("email")).clear();
        await driver.findElement(By.name("password")).clear();
        await driver.findElement(By.name("email")).sendKeys("rumerjaved9@gmail.com");
        await driver.findElement(By.name("password")).sendKeys("143341..")
        await driver.findElement(By.css("button[type='submit']")).click();
        await driver.sleep(8000);
        await driver.get(`${baseUrl}/dashboard/cart`);
        await driver.wait(until.titleContains('Your Cart'), 10000);


        // Test 2: Create Category
        await driver.get(`${baseUrl}/login`);
        await driver.findElement(By.name("email")).clear();
        await driver.findElement(By.name("password")).clear();
        await driver.findElement(By.name("email")).sendKeys("rumerjaved9@gmail.com");
        await driver.findElement(By.name("password")).sendKeys("143341..")
        await driver.findElement(By.css("button[type='submit']")).click();
        await driver.sleep(8000);
	const categoryName = `Test Category ${Date.now()}`;
        await driver.get(`${baseUrl}/category`);
        const addBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Add New Category')]")), 5000);
        await addBtn.click();
        const nameInput = await driver.wait(until.elementLocated(By.id("categoryName")), 5000);
        await nameInput.sendKeys(categoryName);
        const submitBtn = await driver.findElement(By.css("button[type='submit']"));
        await submitBtn.click();
        await driver.sleep(2000); // Give time for modal to close and list to refresh
        const pageSource = await driver.getPageSource();
        try {
        const newCat = await driver.wait(until.elementLocated(By.xpath(`//*[contains(normalize-space(), '${categoryName}')]`)), 5000);
        console.log("✅ Category created and visible:", categoryName);
        } catch (e) {
        console.error("❌ Category not found in DOM:", categoryName);
        throw e;
	}


	// Test 3: Sign up
	await driver.get(`${baseUrl}/register`);
	await driver.findElement(By.name('name')).sendKeys('Test User');
	await driver.findElement(By.name('email')).sendKeys(`testuser${Date.now()}@example.com`);
	await driver.findElement(By.name('password')).sendKeys('Test@123');
	await driver.findElement(By.name('phone')).sendKeys('03001234567');
	await driver.findElement(By.name('address')).sendKeys('Test Address');
	await driver.findElement(By.name('answer')).sendKeys('Einstein');

	const anotherSubmitBtn = await driver.findElement(By.css("button[type='submit']"));

	await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'})", anotherSubmitBtn);
	await driver.wait(until.elementIsVisible(anotherSubmitBtn), 5000);
	await driver.wait(until.elementIsEnabled(anotherSubmitBtn), 5000);
	await driver.sleep(1000);
	await anotherSubmitBtn.click();

	await driver.sleep(10000);

	const currentUrl = await driver.getCurrentUrl();
	if (!currentUrl.includes("register")) {
    	console.log("✅ Registration successful");
	} else {
    	console.log("❌ Registration failed or message not found");
	}

	// Test 4: Homepage loads
        await driver.get(baseUrl);
        await driver.wait(until.titleContains("ShopSphere"), 5000);
        console.log("✅ Homepage loaded");

        // Test 5: Invalid login does not redirect
        await driver.get(`${baseUrl}/login`);
        await driver.findElement(By.name("email")).sendKeys("invalid@example.com");
        await driver.findElement(By.name("password")).sendKeys("wrongpassword");
        await driver.findElement(By.css("button[type='submit']")).click();
        await driver.sleep(2000);
        let url = await driver.getCurrentUrl();
        if (!url.includes("/dashboard")) {
            console.log("✅ Failed login did not redirect to dashboard");
        } else {
            console.log("❌ Failed login redirected to dashboard");
        }

        // Test 6: Registration form visible
        await driver.get(`${baseUrl}/register`);
        const registerForm = await driver.findElement(By.css("form"));
        if (registerForm) {
            console.log("✅ Registration form loaded");
        }


	// Test 7: Login as admin
	await driver.get(`${baseUrl}/adminlogin`);
	await driver.findElement(By.name("name")).sendKeys("admin");
	await driver.findElement(By.name("password")).sendKeys("devops123");

	const loginBtn = await driver.wait(until.elementLocated(By.css("button[type='submit']")), 5000);
	await driver.wait(until.elementIsVisible(loginBtn), 5000);
	await loginBtn.click();

	await driver.sleep(3000); // Optional: adjust if needed

	const newCurrentUrl = await driver.getCurrentUrl();
	driver.sleep(5000);
	if (!newCurrentUrl.includes("adminlogin")) {
    		console.log("✅ Logged in successfully as admin");
	} else {
    		console.log("❌ Admin login failed or still on login page");
	}


	// Test 8: Contact page loads
        await driver.get(`${baseUrl}/contact`);
        await driver.wait(until.titleContains("Contact"), 5000);
        console.log("✅ Contact page loaded");

	// Test 9: About Us page loads
	await driver.get(`${baseUrl}/about`);
	await driver.wait(until.titleContains("About"), 5000);
	console.log("✅ About us page loaded");

	// Test 10: Logout
	await driver.get(`${baseUrl}`)
	const userMenu = await driver.findElement(By.xpath("//a[contains(@class, 'dropdown-toggle') and contains(text(), 'Umer')]"));
	await userMenu.click();
	await driver.sleep(1000);
	const logoutOption = await driver.findElement(By.xpath("//a[contains(text(), 'Logout')]"));
	await logoutOption.click();
	await driver.sleep(2000);

	const newerCurrentUrl = await driver.getCurrentUrl();
	if (newerCurrentUrl.includes("/login")) {
	    console.log("✅ Logout test passed.");
	} else {
	    console.log("❌ Logout test failed: Redirect not detected.");
	}

    } catch (error) {
        console.error(" ");
    } finally {
        await driver.quit();
    }
}

runTests();


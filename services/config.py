db_config = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': 'root',
    'database': 'test'
}

address_remote_driver = 'http://127.0.0.1:4444/wd/hub'  # remote2

capabilities = {
    "name": 'Fake Student',
    "os": "Windows",
    "os_version": "10",
    "marionette": True,
    "browserName": "firefox",
    "acceptInsecureCerts": True,
    "selenoid:options": {
        "enableVNC": True,
        "enableVideo": False,
        "screenResolution": "1920x1080x24",
        "dom.webdriver.enabled": False,
        "useAutomationExtension": False,
    }
}
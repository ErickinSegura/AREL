/*package com.springboot.MyTodoList.UI;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;

import java.time.Duration;
import java.util.List;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class SprintUITest {

    private WebDriver driver;

    @BeforeAll
    void setUp() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    }

    @Test
    void sprintPageRendersColumns() {
        driver.get("http://localhost:8080/sprint");

        // Espera a que cargue todo
        try {
            Thread.sleep(3000); // ⚠️ Considera usar WebDriverWait en producción
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        List<WebElement> columnas = driver.findElements(By.xpath("//*[contains(text(),'To Do') or contains(text(),'Doing') or contains(text(),'Done')]"));
        Assertions.assertFalse(columnas.isEmpty(), "No se detectaron las columnas de Sprint");
    }

    @AfterAll
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
*/
package springboot.MyTodoList.selenium;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import io.github.bonigarcia.wdm.WebDriverManager;

import static org.junit.jupiter.api.Assertions.*;

public class FrontendUITest {

    private WebDriver driver;

    @BeforeEach
    public void setUp() {
        WebDriverManager.chromedriver().setup();  // descarga el driver automáticamente
        driver = new ChromeDriver();
    }

    @Test
    public void testAddShortcutInputIsPresent() {
        driver.get("http://localhost:8080");

        WebElement input = driver.findElement(By.xpath("//input[@placeholder='Add shortcut']"));
        assertNotNull(input);

        input.sendKeys("https://mi-url.com");
        WebElement addButton = driver.findElement(By.xpath("//button[text()='Add']")); // si tienes un botón con ese texto
        addButton.click();

        // Aquí podrías validar si el shortcut aparece en la lista, depende de cómo se muestre
    }

    @AfterEach
    public void tearDown() {
        driver.quit(); // Cierra el navegador después del test
    }
}

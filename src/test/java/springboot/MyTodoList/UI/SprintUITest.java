package springboot.MyTodoList.UI;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class SprintUITest {

    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeEach
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, 10); // segundo parámetro como int para compatibilidad
    }

    @Test
    public void testSprintViewLoadsCorrectly() {
        driver.get("http://localhost:8080/sprint");

        WebElement title = wait.until((Function<WebDriver, WebElement>)
                ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(),'Sprint Board')]")));
        assertTrue(title.isDisplayed());

        WebElement completeButton = wait.until((Function<WebDriver, WebElement>)
                ExpectedConditions.presenceOfElementLocated(By.xpath("//button[contains(text(),'Complete Sprint')]")));
        assertTrue(completeButton.isDisplayed());

        List<WebElement> columns = driver.findElements(By.className("transition-all"));
        assertTrue(columns.size() > 0);
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
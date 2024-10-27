export const javaTemplate = `
// Template for Java (java.template.java)

// Importing libraries
import java.util.*;
import java.math.*;

public class Main {    
    public static void main(String[] args) {
        runTests();
    }
    
    public static void runTests() {
        Solution solution = new Solution();
        try {
            {{{test_cases}}}
            System.out.println("All tests passed.");
        } catch (AssertionError error) {
            System.err.println("Test case failed: " + error.getMessage());
        } catch (Exception e) {
            System.err.println("An error occurred: " + e.getMessage());
        }
    }
}

{{{user_code}}}
`

export const javaTestCaseTemplate = `
            if (!{{{comparison}}}) {
                throw new AssertionError("Expected " + Arrays.toString({{{outputVar}}}) + ", but got " + Arrays.toString({{{callingFunction}}}));
            }
`

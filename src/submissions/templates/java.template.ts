export const javaTemplate = `
// Template for Java (java.template.java)

public class Main {
    
    {{{user_code}}}
    
    public static void main(String[] args) {
        runTests();
    }
    
    public static void runTests() {
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
`

export const javaTestCaseTemplate = `
            if (!{{function_name}}({{{parsed_inputs}}}).equals({{{expected_outputs}}})) {
                throw new AssertionError("Expected " + {{{expected_outputs}}} + ", but got " + {{function_name}}({{{parsed_inputs}}}));
            }
`

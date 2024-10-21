export const javascriptTemplate = `
// Template for JavaScript (javascript.template.ts)

{{{user_code}}}

function runTests() {
  try {
    {{{test_cases}}}
    console.log("All tests passed.");
  } catch (error) {
    console.error("Test case failed:", error.message);
  }
}

runTests();
`

export const javascriptTestCaseTemplate = `
    if (JSON.stringify({{function_name}}({{{parsed_inputs}}})) !== JSON.stringify({{{expected_outputs}}})) {
      throw new Error('Expected {{{expected_outputs}}}, but got ' + {{function_name}}({{{parsed_inputs}}}));
    }
`

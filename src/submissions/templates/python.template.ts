export const pythonTemplate = `
# Template for Python (python.template.py)

{{{user_code}}}

def runTests():
    try:
        {{{test_cases}}}
        print("All tests passed.")
    except Exception as error:
        print("Test case failed:", error)

runTests()
`

export const pythonTestCaseTemplate = `
        if {{{function_name}}}({{{parsed_inputs}}}) != {{{expected_outputs}}}:
            raise Exception('Expected {{{expected_outputs}}}, but got ' + {{{function_name}}}({{{parsed_inputs}}}))
`

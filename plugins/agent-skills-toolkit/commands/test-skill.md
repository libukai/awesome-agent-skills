---
name: test-skill
description: Test and evaluate Agent Skill performance with benchmarks
argument-hint: "[skill-name or path]"
---

# Test and Evaluate Skill

You are helping the user test and evaluate an Agent Skill's performance.

**IMPORTANT**: First invoke `/agent-skills-toolkit:skill-creator-pro` to load the complete testing and evaluation framework, including scripts and evaluation tools.

Once skill-creator-pro is loaded, use the evaluation workflow and tools:

## Quick Testing Process

1. **Prepare Test Cases**
   - Review existing test prompts
   - Add new test cases if needed
   - Cover various scenarios

2. **Run Tests** (use skill-creator-pro's scripts)
   - Execute test prompts with the skill
   - Use `scripts/run_eval.py` for automated testing
   - Use `scripts/run_loop.py` for batch testing
   - Collect results and outputs

3. **Qualitative Evaluation**
   - Review outputs with the user
   - Use `eval-viewer/generate_review.py` to visualize results
   - Assess quality and accuracy
   - Identify improvement areas

4. **Quantitative Metrics** (use skill-creator-pro's tools)
   - Run `scripts/aggregate_benchmark.py` for metrics
   - Measure success rates
   - Calculate variance analysis
   - Compare with baseline

5. **Generate Report**
   - Use `scripts/generate_report.py` for comprehensive reports
   - Summarize test results
   - Highlight strengths and weaknesses
   - Provide actionable recommendations

## Available Tools from skill-creator-pro

- `scripts/run_eval.py` - Run evaluations
- `scripts/run_loop.py` - Batch testing
- `scripts/aggregate_benchmark.py` - Aggregate metrics
- `scripts/generate_report.py` - Generate reports
- `eval-viewer/generate_review.py` - Visualize results
- `agents/grader.md` - Grading subagent
- `agents/analyzer.md` - Analysis subagent
- `agents/comparator.md` - Comparison subagent

## Evaluation Criteria

- **Accuracy**: Does it produce correct results?
- **Consistency**: Are results reliable across runs?
- **Completeness**: Does it handle all use cases?
- **Efficiency**: Is the workflow optimal?
- **Usability**: Is it easy to trigger and use?

## Next Steps

Based on test results:
- Run `/agent-skills-toolkit:improve-skill` to address issues
- Expand test coverage for edge cases
- Document findings for future reference

# CLI and CI/CD Integration for httpYac

Complete guide to using httpYac CLI and integrating with CI/CD pipelines.

## CLI Installation

### Global Installation

```bash
# npm
npm install -g httpyac

# yarn
yarn global add httpyac

# Verify installation
httpyac --version
```

### Project-Local Installation

```bash
# npm
npm install --save-dev httpyac

# yarn
yarn add --dev httpyac

# Run with npx
npx httpyac --version
```

---

## Basic CLI Commands

### Send Requests

```bash
# Run single file
httpyac send api.http

# Run all requests in file
httpyac send api.http --all

# Run multiple files
httpyac send api/*.http

# Run specific request by name
httpyac send api.http --name getUsers

# Run with specific environment
httpyac send api.http --env production

# Run with variable overrides
httpyac send api.http --var API_TOKEN=custom_token
```

### Output Options

```bash
# Output to file
httpyac send api.http --output results.json

# Output format (json, short, none)
httpyac send api.http --output-format json

# Quiet mode (no output)
httpyac send api.http --quiet

# Verbose mode
httpyac send api.http --verbose

# Show response headers
httpyac send api.http --show-headers
```

### Filtering

```bash
# Filter by request name
httpyac send api.http --name "login|getUsers"

# Filter by regex
httpyac send api.http --filter "get.*"

# Run only failed requests
httpyac send api.http --only-failed

# Repeat requests
httpyac send api.http --repeat 5
```

---

## Environment Management

### Load Environment Files

```bash
# Default (.env)
httpyac send api.http

# Specific environment
httpyac send api.http --env production

# Custom env file
httpyac send api.http --env-file .env.custom

# Multiple env files
httpyac send api.http --env-file .env --env-file .env.local
```

### Variable Overrides

```bash
# Single variable
httpyac send api.http --var API_BASE_URL=http://localhost:3000

# Multiple variables
httpyac send api.http \
  --var API_BASE_URL=http://localhost:3000 \
  --var API_TOKEN=test_token_123 \
  --var DEBUG=true

# Variables from file
httpyac send api.http --var-file custom-vars.env
```

---

## CI/CD Integration

### GitHub Actions

#### Basic Setup

```yaml
name: API Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install httpYac
        run: npm install -g httpyac
      
      - name: Run API Tests
        run: httpyac send tests/*.http --all
        env:
          API_BASE_URL: ${{ secrets.API_BASE_URL }}
          API_TOKEN: ${{ secrets.API_TOKEN }}
      
      - name: Upload Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: httpyac-output/
```

#### Multi-Environment Testing

```yaml
name: Multi-Environment API Tests

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours

jobs:
  test-dev:
    name: Test Development
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g httpyac
      - name: Run Dev Tests
        run: httpyac send tests/*.http --env dev --all
        env:
          API_BASE_URL: ${{ secrets.DEV_API_BASE_URL }}
          API_TOKEN: ${{ secrets.DEV_API_TOKEN }}

  test-staging:
    name: Test Staging
    runs-on: ubuntu-latest
    needs: test-dev
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g httpyac
      - name: Run Staging Tests
        run: httpyac send tests/*.http --env staging --all
        env:
          API_BASE_URL: ${{ secrets.STAGING_API_BASE_URL }}
          API_TOKEN: ${{ secrets.STAGING_API_TOKEN }}

  test-production:
    name: Test Production
    runs-on: ubuntu-latest
    needs: test-staging
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g httpyac
      - name: Run Production Tests
        run: httpyac send tests/*.http --env production --all
        env:
          API_BASE_URL: ${{ secrets.PROD_API_BASE_URL }}
          API_TOKEN: ${{ secrets.PROD_API_TOKEN }}
      
      - name: Notify on Failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production API tests failed!'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

#### With Test Reports

```yaml
name: API Tests with Reports

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install httpYac
        run: npm install -g httpyac
      
      - name: Run Tests
        id: httpyac
        continue-on-error: true
        run: |
          httpyac send tests/*.http \
            --all \
            --output-format json \
            --output results.json
        env:
          API_BASE_URL: ${{ secrets.API_BASE_URL }}
          API_TOKEN: ${{ secrets.API_TOKEN }}
      
      - name: Generate Report
        if: always()
        run: |
          echo "## API Test Results" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          
          if [ -f results.json ]; then
            TOTAL=$(jq '.requests | length' results.json)
            PASSED=$(jq '[.requests[] | select(.response.statusCode < 400)] | length' results.json)
            FAILED=$(( TOTAL - PASSED ))
            
            echo "- Total: $TOTAL" >> $GITHUB_STEP_SUMMARY
            echo "- Passed: ✅ $PASSED" >> $GITHUB_STEP_SUMMARY
            echo "- Failed: ❌ $FAILED" >> $GITHUB_STEP_SUMMARY
          fi
      
      - name: Upload Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: results.json
      
      - name: Fail on Test Failure
        if: steps.httpyac.outcome == 'failure'
        run: exit 1
```

---

### GitLab CI

#### Basic Setup

```yaml
stages:
  - test

api-tests:
  stage: test
  image: node:18
  before_script:
    - npm install -g httpyac
  script:
    - httpyac send tests/*.http --all
  variables:
    API_BASE_URL: ${API_BASE_URL}
    API_TOKEN: ${API_TOKEN}
  artifacts:
    when: always
    paths:
      - httpyac-output/
    reports:
      junit: httpyac-output/junit.xml
```

#### Multi-Environment Pipeline

```yaml
stages:
  - test-dev
  - test-staging
  - test-production

.test-template:
  image: node:18
  before_script:
    - npm install -g httpyac
  artifacts:
    when: always
    paths:
      - httpyac-output/

test:dev:
  extends: .test-template
  stage: test-dev
  script:
    - httpyac send tests/*.http --env dev --all
  variables:
    API_BASE_URL: ${DEV_API_BASE_URL}
    API_TOKEN: ${DEV_API_TOKEN}

test:staging:
  extends: .test-template
  stage: test-staging
  script:
    - httpyac send tests/*.http --env staging --all
  variables:
    API_BASE_URL: ${STAGING_API_BASE_URL}
    API_TOKEN: ${STAGING_API_TOKEN}
  only:
    - develop
    - main

test:production:
  extends: .test-template
  stage: test-production
  script:
    - httpyac send tests/*.http --env production --all
  variables:
    API_BASE_URL: ${PROD_API_BASE_URL}
    API_TOKEN: ${PROD_API_TOKEN}
  only:
    - main
  when: manual
```

#### Scheduled Tests

```yaml
scheduled-tests:
  stage: test
  image: node:18
  before_script:
    - npm install -g httpyac
  script:
    - httpyac send tests/*.http --env production --all
  variables:
    API_BASE_URL: ${PROD_API_BASE_URL}
    API_TOKEN: ${PROD_API_TOKEN}
  only:
    - schedules
  artifacts:
    when: always
    paths:
      - httpyac-output/
  after_script:
    - |
      if [ $CI_JOB_STATUS == 'failed' ]; then
        curl -X POST $SLACK_WEBHOOK_URL \
          -H 'Content-Type: application/json' \
          -d '{"text":"API tests failed in scheduled run"}'
      fi
```

---

### CircleCI

```yaml
version: 2.1

executors:
  node-executor:
    docker:
      - image: cimg/node:18.0

jobs:
  api-tests:
    executor: node-executor
    steps:
      - checkout
      
      - run:
          name: Install httpYac
          command: npm install -g httpyac
      
      - run:
          name: Run API Tests
          command: httpyac send tests/*.http --all
          environment:
            API_BASE_URL: ${API_BASE_URL}
            API_TOKEN: ${API_TOKEN}
      
      - store_artifacts:
          path: httpyac-output
          destination: test-results
      
      - store_test_results:
          path: httpyac-output

workflows:
  version: 2
  test:
    jobs:
      - api-tests:
          context: api-credentials
```

---

### Jenkins

#### Jenkinsfile

```groovy
pipeline {
    agent any
    
    environment {
        API_BASE_URL = credentials('api-base-url')
        API_TOKEN = credentials('api-token')
    }
    
    stages {
        stage('Setup') {
            steps {
                sh 'npm install -g httpyac'
            }
        }
        
        stage('API Tests') {
            steps {
                sh 'httpyac send tests/*.http --all --output-format json --output results.json'
            }
        }
        
        stage('Results') {
            steps {
                archiveArtifacts artifacts: 'results.json', fingerprint: true
                
                script {
                    def results = readJSON file: 'results.json'
                    def total = results.requests.size()
                    def passed = results.requests.findAll { it.response.statusCode < 400 }.size()
                    def failed = total - passed
                    
                    echo "Total: ${total}"
                    echo "Passed: ${passed}"
                    echo "Failed: ${failed}"
                    
                    if (failed > 0) {
                        error("${failed} API tests failed")
                    }
                }
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'httpyac-output/**', allowEmptyArchive: true
        }
        failure {
            mail to: 'team@example.com',
                 subject: "API Tests Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                 body: "Check console output at ${env.BUILD_URL}"
        }
    }
}
```

---

### Azure DevOps

```yaml
trigger:
  - main
  - develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  API_BASE_URL: $(API_BASE_URL_SECRET)
  API_TOKEN: $(API_TOKEN_SECRET)

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'
    displayName: 'Install Node.js'
  
  - script: npm install -g httpyac
    displayName: 'Install httpYac'
  
  - script: |
      httpyac send tests/*.http --all --output-format json --output results.json
    displayName: 'Run API Tests'
    env:
      API_BASE_URL: $(API_BASE_URL)
      API_TOKEN: $(API_TOKEN)
  
  - task: PublishBuildArtifacts@1
    condition: always()
    inputs:
      PathtoPublish: 'results.json'
      ArtifactName: 'test-results'
    displayName: 'Publish Test Results'
  
  - script: |
      TOTAL=$(jq '.requests | length' results.json)
      PASSED=$(jq '[.requests[] | select(.response.statusCode < 400)] | length' results.json)
      FAILED=$((TOTAL - PASSED))
      
      echo "Total: $TOTAL"
      echo "Passed: $PASSED"
      echo "Failed: $FAILED"
      
      if [ $FAILED -gt 0 ]; then
        exit 1
      fi
    displayName: 'Evaluate Results'
```

---

## Docker Integration

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install httpYac globally
RUN npm install -g httpyac

# Copy test files
COPY tests/ ./tests/
COPY .env.example ./.env

# Set environment variables
ENV API_BASE_URL=http://api.example.com
ENV NODE_ENV=production

# Run tests
CMD ["httpyac", "send", "tests/*.http", "--all"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  api-tests:
    build: .
    environment:
      - API_BASE_URL=${API_BASE_URL}
      - API_TOKEN=${API_TOKEN}
    volumes:
      - ./tests:/app/tests:ro
      - ./results:/app/results
    command: >
      sh -c "httpyac send tests/*.http --all --output results/output.json"
```

### Run Tests in Docker

```bash
# Build image
docker build -t api-tests .

# Run tests
docker run --rm \
  -e API_BASE_URL=http://api.example.com \
  -e API_TOKEN=your_token \
  -v $(pwd)/results:/app/results \
  api-tests

# With docker-compose
docker-compose run --rm api-tests
```

---

## Advanced CLI Features

### Parallel Execution

```bash
# Run multiple files in parallel (use GNU parallel or xargs)
find tests -name '*.http' | xargs -P 4 -I {} httpyac send {}

# GNU parallel
parallel httpyac send ::: tests/*.http
```

### Conditional Execution

```bash
# Run tests and capture exit code
if httpyac send tests/critical.http --all; then
  echo "✓ Critical tests passed, running full suite"
  httpyac send tests/*.http --all
else
  echo "✗ Critical tests failed, aborting"
  exit 1
fi
```

### Custom Reporting

```bash
# Generate custom report
httpyac send tests/*.http --all --output-format json --output results.json

# Parse results with jq
jq '.requests[] | {name: .name, status: .response.statusCode, duration: .response.duration}' results.json

# Generate HTML report
cat results.json | jq -r '
  "<html><body><h1>API Test Results</h1>" +
  "<table border=\"1\">" +
  "<tr><th>Request</th><th>Status</th><th>Duration</th></tr>" +
  (.requests[] | 
    "<tr><td>\(.name)</td><td>\(.response.statusCode)</td><td>\(.response.duration)ms</td></tr>"
  ) +
  "</table></body></html>"
' > report.html
```

### Monitoring Integration

```bash
# Send metrics to monitoring system
httpyac send tests/*.http --all --output-format json --output results.json

# Extract metrics and send to monitoring
TOTAL=$(jq '.requests | length' results.json)
FAILED=$(jq '[.requests[] | select(.response.statusCode >= 400)] | length' results.json)
AVG_DURATION=$(jq '[.requests[].response.duration] | add / length' results.json)

# Send to monitoring service (e.g., Datadog, Prometheus)
curl -X POST https://monitoring.example.com/metrics \
  -d "api.tests.total=$TOTAL" \
  -d "api.tests.failed=$FAILED" \
  -d "api.tests.avg_duration=$AVG_DURATION"
```

---

## Troubleshooting CLI

### Common Issues

**Issue: Command not found**
```bash
# Verify installation
which httpyac
npm list -g httpyac

# Reinstall
npm install -g httpyac
```

**Issue: Environment variables not loaded**
```bash
# Debug variable loading
httpyac send api.http --verbose

# Explicitly set variables
export API_BASE_URL=http://localhost:3000
httpyac send api.http

# Use --var flag
httpyac send api.http --var API_BASE_URL=http://localhost:3000
```

**Issue: Permission denied**
```bash
# Fix permissions
chmod +x api.http

# Use sudo for global install (not recommended)
sudo npm install -g httpyac
```

---

## Best Practices

### CI/CD Configuration

1. **Use secrets management** - Store credentials in CI/CD secrets, not in code
2. **Fail fast** - Run critical tests first, abort on failure
3. **Parallel execution** - Run independent test suites in parallel
4. **Retry flaky tests** - Implement retry logic for network issues
5. **Cache dependencies** - Cache Node.js modules for faster builds
6. **Artifact storage** - Save test results for debugging

### Test Organization

```
tests/
├── critical/          # Must-pass tests
│   ├── auth.http
│   └── health.http
├── integration/       # Full workflow tests
│   ├── user-flow.http
│   └── order-flow.http
├── regression/        # Edge cases
│   └── edge-cases.http
└── .httpyac.json     # Shared configuration
```

### Script Integration

```bash
#!/bin/bash
# run-api-tests.sh

set -e  # Exit on error

echo "🚀 Starting API tests..."

# Load environment
source .env

# Run critical tests first
echo "⚡ Running critical tests..."
if ! httpyac send tests/critical/*.http --all; then
  echo "✗ Critical tests failed, aborting"
  exit 1
fi

# Run full test suite
echo "🧪 Running full test suite..."
httpyac send tests/**/*.http --all --output results.json

# Generate report
echo "📊 Generating report..."
node scripts/generate-report.js results.json

echo "✓ All tests completed"
```

---

## Quick Reference

**Run tests:**
```bash
httpyac send api.http --all
```

**With environment:**
```bash
httpyac send api.http --env production
```

**Override variables:**
```bash
httpyac send api.http --var API_TOKEN=token123
```

**Output to file:**
```bash
httpyac send api.http --output results.json
```

**GitHub Actions:**
```yaml
- run: npm install -g httpyac
- run: httpyac send tests/*.http --all
  env:
    API_TOKEN: ${{ secrets.API_TOKEN }}
```

**GitLab CI:**
```yaml
test:
  script:
    - npm install -g httpyac
    - httpyac send tests/*.http --all
  variables:
    API_TOKEN: ${API_TOKEN}
```

**Docker:**
```dockerfile
RUN npm install -g httpyac
CMD ["httpyac", "send", "tests/*.http", "--all"]
```

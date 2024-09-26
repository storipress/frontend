#!/bin/bash

cd "${GITHUB_WORKSPACE}/${INPUT_WORKDIR}" || exit 1

export REVIEWDOG_GITHUB_API_TOKEN="${INPUT_GITHUB_TOKEN}"


  echo ℹ️ vue-tsc version: "$("$(npm bin)"/vue-tsc --version)"

  echo "::group::📝 Running vue-tsc with reviewdog 🐶 ..."

  echo INPUT_TSC_FLAGS: ${INPUT_TSC_FLAGS}
  echo INPUT_REVIEWDOG_FLAGS: ${INPUT_REVIEWDOG_FLAGS}
  echo INPUT_REPORTER: ${INPUT_REPORTER}

  # shellcheck disable=SC2086
  "$(npm bin)"/vue-tsc --noEmit ${INPUT_TSC_FLAGS} \
    | reviewdog -f=tsc \
      -name="${INPUT_TOOL_NAME}" \
      -reporter="${INPUT_REPORTER}" \
      -filter-mode="${INPUT_FILTER_MODE}" \
      -fail-on-error="${INPUT_FAIL_ON_ERROR}" \
      -level="${INPUT_LEVEL}" \
      ${INPUT_REVIEWDOG_FLAGS}

  reviewdog_rc=$?
  echo "::endgroup::"
  exit $reviewdog_rc

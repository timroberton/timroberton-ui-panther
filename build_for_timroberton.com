#!/bin/sh

# Compile with tsc
tsc

# Clean extensions in dist folder
find ./dist -type f -exec sed -i '' -e '/from \"/ s/.ts\";/\";/g' {} \;

# Commit to github

rm -r /Users/timroberton/projects/_4_TIMROBERTON/timroberton.com/src/ui
cp -r /Users/timroberton/projects/_TIM_LIBS/timroberton-ui-panther/dist /Users/timroberton/projects/_4_TIMROBERTON/timroberton.com/src/ui

rm -r /Users/timroberton/projects/_4_TIMROBERTON/roberton.io/src/ui
cp -r /Users/timroberton/projects/_TIM_LIBS/timroberton-ui-panther/dist /Users/timroberton/projects/_4_TIMROBERTON/roberton.io/src/ui

# Commit to github
today=`date +%Y_%m_%d_%H_%M_%S`
git add . && \
git commit -m "Update at $today" --allow-empty && \
git push
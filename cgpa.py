#CGPA calculator

import pandas as pd
total = 10

subs = int(input())
detail ={}
credit = 0
grade_score = 0
for x in range(subs):
  sub_name = str(input())
  sub_credit = int(input())
  sub_mark = int(input())

  if sub_mark in range(91,101):
    grade_point = 10
    sub_grade = 'O'
  elif sub_mark in range(81,91):
    grade_point = 9
    sub_grade = 'A+'
  elif sub_mark in range(71,81):
    grade_point = 8
    sub_grade = 'A'
  elif sub_mark in range(61,71):
    grade_point = 7
    sub_grade = 'B+'
  elif sub_mark in range(56,61):
    grade_point = 6
    sub_grade = 'B'
  elif sub_mark in range(50,56):
    grade_point = 5
    sub_grade = 'C'
  elif sub_mark in range(0,50):
    grade_point = 0
    sub_grade = 'F'
  detail[sub_name] = {'Credit': sub_credit, 'Grade': sub_grade, 'Grade Score': grade_point}
total_credits = 0
total_points = 0
for x in detail:
  credit = detail[x]['Credit']
  grade_score = detail[x]['Grade Score']
  total_credits += credit
  total_points += credit * grade_score
df1 = pd.DataFrame(detail).T.reset_index()
df1.rename(columns={'index': 'Subject'}, inplace=True)
gpa = total_points / total_credits

print(df1)
print()
print(f"Your CGPA for this semester is {gpa}")
import json
from flask import Flask, request, jsonify
from sympy.parsing.latex import parse_latex

app = Flask(__name__)

@app.route('/evaluate', methods=['POST'])
def evaluate_expression():
    data = request.get_json()
    print(data)
    replaced_string = data['replacedString']
    print(replaced_string)

    try:
        expr = parse_latex(replaced_string)
        result = expr.evalf()
        print(expr, result)
        return jsonify({'result': str(result), 'expression': str(expr)})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)

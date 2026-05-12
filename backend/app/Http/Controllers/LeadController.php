<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function index(){
        $leads = Lead::all();

        return response()->json($leads);

    }
    public function create(){

    }
    public function store(){

    }
    public function edit(){

    }
    public function update(){

    }
    public function destroy(){

    }
    public function show(){

    }

}
